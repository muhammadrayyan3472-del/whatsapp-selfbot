const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function normalizeId(id) {
  try {
    if (id && id._serialized == null && id.$1 != null) id._serialized = id.$1;
  } catch {}
  return id;
}

async function getChat(ctx) {
  if (ctx.chat) return ctx.chat;
  try { return await ctx.msg.getChat(); } catch {}
  try { return await ctx.client.getChatById(ctx.msg.from || ctx.msg.to); } catch {}
  return null;
}

async function getContact(ctx) {
  if (ctx.contact) return ctx.contact;
  try { return await ctx.msg.getContact(); } catch {}
  return null;
}

async function getQuoted(ctx) {
  if (!ctx.msg.hasQuotedMsg) return null;
  try {
    const q = await ctx.msg.getQuotedMessage();
    normalizeId(q?.id);
    return q;
  } catch {
    return null;
  }
}

async function requireChat(ctx) {
  const c = await getChat(ctx);
  if (!c) {
    await ctx.msg.reply('Could not resolve this chat right now. Try again after WhatsApp finishes syncing.');
    return null;
  }
  return c;
}

async function requireQuoted(ctx) {
  const q = await getQuoted(ctx);
  if (!q) {
    await ctx.msg.reply('Reply to a message first.');
    return null;
  }
  return q;
}

function safeName(c) {
  return c?.pushname || c?.name || c?.shortName || c?.number || 'Unknown';
}

function jidOf(c) {
  return c?.id?._serialized || c?.id?.$1 || c?.id || 'unknown';
}

function words(s) {
  return String(s || '').trim().split(/\s+/).filter(Boolean);
}

function titleCase(s) {
  return String(s || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function reverse(s) {
  return [...String(s || '')].reverse().join('');
}

function rot13(s) {
  return String(s || '').replace(/[a-z]/gi, c => {
    const n = c.charCodeAt(0), b = n < 97 ? 65 : 97;
    return String.fromCharCode((n - b + 13) % 26 + b);
  });
}

function morseEncode(s) {
  const m = {
    a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',
    k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',
    u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..',
    0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'
  };
  return String(s || '').toLowerCase().split('').map(c => c === ' ' ? '/' : (m[c] || c)).join(' ');
}

function morseDecode(s) {
  const m = {
    '.-':'a','-...':'b','-.-.':'c','-..':'d','.':'e','..-.':'f','--.':'g','....':'h','..':'i','.---':'j',
    '-.-':'k','.-..':'l','--':'m','-.':'n','---':'o','.--.':'p','--.-':'q','.-.':'r','...':'s','-':'t',
    '..-':'u','...-':'v','.--':'w','-..-':'x','-.--':'y','--..':'z',
    '-----':'0','.----':'1','..---':'2','...--':'3','....-':'4','.....':'5','-....':'6','--...':'7','---..':'8','----.':'9'
  };
  return String(s || '').trim().split(/\s+/).map(x => x === '/' ? ' ' : (m[x] || x)).join('');
}

function hash(algo, s) {
  return crypto.createHash(algo).update(String(s || '')).digest('hex');
}

function bytes(n) {
  n = Number(n);
  if (!Number.isFinite(n)) return 'NaN';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0, x = Math.abs(n);
  while (x >= 1024 && i < u.length - 1) {
    x /= 1024;
    i++;
  }
  return `${n < 0 ? '-' : ''}${x.toFixed(2)} ${u[i]}`;
}

function parseDuration(s) {
  const m = String(s || '').match(/^(\d+(?:\.\d+)?)(s|m|h|d|w)$/i);
  if (!m) return null;
  return Number(m[1]) * ({ s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 }[m[2].toLowerCase()]);
}

async function downloadQuotedMedia(ctx, name = 'media') {
  const q = await getQuoted(ctx);
  if (!q?.hasMedia) return null;
  try {
    const media = await q.downloadMedia();
    if (!media) return null;
    const ext = (media.mimetype || 'application/octet-stream').split('/')[1]?.split(';')[0] || 'bin';
    const out = path.join(process.cwd(), 'downloads', `${Date.now()}_${String(name).replace(/[^a-z0-9_-]/gi, '_')}.${ext}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(media.data, 'base64'));
    return { media, out, q };
  } catch {
    return null;
  }
}

// Safe recursive descent math evaluator without eval()
function evalMath(str) {
  str = String(str || '').replace(/\s+/g, '');
  if (!str) throw new Error('Empty expression');
  let pos = 0;
  function peek() { return str[pos]; }
  function get() { return str[pos++]; }

  function parseExpr() {
    let x = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = get();
      const y = parseTerm();
      x = op === '+' ? x + y : x - y;
    }
    return x;
  }

  function parseTerm() {
    let x = parsePower();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = get();
      const y = parsePower();
      if (op === '*') x *= y;
      else if (op === '/') { if (y === 0) throw new Error('Division by zero'); x /= y; }
      else x %= y;
    }
    return x;
  }

  function parsePower() {
    let x = parseFactor();
    if (peek() === '^') {
      get();
      const y = parsePower();
      x = Math.pow(x, y);
    }
    return x;
  }

  function parseFactor() {
    if (peek() === '+') { get(); return parseFactor(); }
    if (peek() === '-') { get(); return -parseFactor(); }
    if (peek() === '(') {
      get();
      const val = parseExpr();
      if (get() !== ')') throw new Error('Missing closing parenthesis');
      return val;
    }
    if (/[a-zA-Z]/.test(peek())) {
      let name = '';
      while (pos < str.length && /[a-zA-Z]/.test(peek())) name += get();
      if (peek() === '(') {
        get();
        const arg = parseExpr();
        if (get() !== ')') throw new Error('Missing closing parenthesis');
        name = name.toLowerCase();
        if (name === 'sqrt') return Math.sqrt(arg);
        if (name === 'abs') return Math.abs(arg);
        if (name === 'round') return Math.round(arg);
        if (name === 'floor') return Math.floor(arg);
        if (name === 'ceil') return Math.ceil(arg);
        if (name === 'sin') return Math.sin(arg * Math.PI / 180);
        if (name === 'cos') return Math.cos(arg * Math.PI / 180);
        if (name === 'tan') return Math.tan(arg * Math.PI / 180);
        if (name === 'log') return Math.log10(arg);
        if (name === 'ln') return Math.log(arg);
        throw new Error('Unknown function: ' + name);
      }
      if (name.toLowerCase() === 'pi') return Math.PI;
      if (name.toLowerCase() === 'e') return Math.E;
      throw new Error('Unknown constant: ' + name);
    }
    let numStr = '';
    while (pos < str.length && (/[0-9]/.test(peek()) || peek() === '.')) numStr += get();
    if (!numStr) throw new Error('Unexpected character: ' + (peek() || 'end of input'));
    return parseFloat(numStr);
  }

  const res = parseExpr();
  if (pos < str.length) throw new Error('Unexpected character: ' + str.slice(pos));
  return res;
}

// Text styling utilities
function vaporwave(s) {
  return [...String(s || '')].map(c => {
    const code = c.charCodeAt(0);
    return (code >= 33 && code <= 126) ? String.fromCharCode(code + 65248) : c;
  }).join('');
}

function bubbleText(s) {
  const map = {
    a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',
    n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ',
    0:'⓪',1:'①',2:'②',3:'③',4:'④',5:'⑤',6:'⑥',7:'⑦',8:'⑧',9:'⑨'
  };
  return String(s || '').toLowerCase().split('').map(c => map[c] || c).join('');
}

function upsideDown(s) {
  const map = {
    a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',
    n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',
    '?':'¿','!':'¡','.':'˙','\'':',',',':'\'','_':'‾'
  };
  return [...String(s || '').toLowerCase()].reverse().map(c => map[c] || c).join('');
}

function mockText(s) {
  return [...String(s || '')].map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('');
}

module.exports = {
  normalizeId,
  getChat,
  getContact,
  getQuoted,
  requireChat,
  requireQuoted,
  safeName,
  jidOf,
  words,
  titleCase,
  reverse,
  rot13,
  morseEncode,
  morseDecode,
  hash,
  bytes,
  parseDuration,
  downloadQuotedMedia,
  evalMath,
  vaporwave,
  bubbleText,
  upsideDown,
  mockText
};
