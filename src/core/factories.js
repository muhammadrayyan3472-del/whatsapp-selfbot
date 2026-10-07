const h = require('./helpers');
const config = require('./config');
const store = require('./store');

function C(name, run, aliases = [], category = 'utility') {
  return { name, aliases, category, run };
}

function textFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    let s = ctx.rest || '';
    if (!s && ctx.msg.hasQuotedMsg) {
      const q = await h.getQuoted(ctx);
      if (q?.body) s = q.body;
    }
    if (!s) return ctx.msg.reply(`Usage: ${config.prefix}${name} <text> (or reply to a message)`);

    let out = s;
    const opNorm = op.toLowerCase().replace(/[-_]/g, '');

    switch (opNorm) {
      case 'upper':
      case 'caps':
        out = s.toUpperCase();
        break;
      case 'lower':
        out = s.toLowerCase();
        break;
      case 'title':
      case 'titlecase':
        out = h.titleCase(s);
        break;
      case 'swap':
      case 'swapcase':
        out = [...s].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      case 'reverse':
        out = h.reverse(s);
        break;
      case 'reversewords':
        out = h.words(s).reverse().join(' ');
        break;
      case 'sortwords':
        out = h.words(s).sort((a, b) => a.localeCompare(b)).join(' ');
        break;
      case 'uniquewords':
        out = [...new Set(h.words(s))].join(' ');
        break;
      case 'shufflewords':
        out = h.words(s).sort(() => Math.random() - 0.5).join(' ');
        break;
      case 'trim':
        out = s.trim();
        break;
      case 'compact':
        out = s.replace(/\s+/g, ' ').trim();
        break;
      case 'slug':
        out = s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        break;
      case 'underscore':
        out = s.trim().split(/\s+/).join('_');
        break;
      case 'dash':
        out = s.trim().split(/\s+/).join('-');
        break;
      case 'dot':
        out = [...s].join('.');
        break;
      case 'spaced':
        out = [...s].join(' ');
        break;
      case 'newline':
        out = s.trim().split(/\s+/).join('\n');
        break;
      case 'strike':
      case 'strikethrough':
        out = [...s].map(c => c + '\u0336').join('');
        break;
      case 'underline':
        out = [...s].map(c => c + '\u0332').join('');
        break;
      case 'bold':
        out = '*' + s.trim() + '*';
        break;
      case 'italic':
        out = '_' + s.trim() + '_';
        break;
      case 'monospace':
      case 'code':
      case 'codeblock':
        out = '```\n' + s + '\n```';
        break;
      case 'quote':
      case 'quoteformat':
        out = s.split(/\r?\n/).map(x => '> ' + x).join('\n');
        break;
      case 'spoiler':
        out = '>! ' + s + ' !<';
        break;
      case 'leet':
        out = s.replace(/[aAeEiIoOsStT]/g, c => ({
          a:'4', A:'4', e:'3', E:'3', i:'1', I:'1', o:'0', O:'0', s:'5', S:'5', t:'7', T:'7'
        }[c]));
        break;
      case 'alt':
      case 'altcaps':
      case 'mock':
        out = h.mockText(s);
        break;
      case 'vaporwave':
        out = h.vaporwave(s);
        break;
      case 'bubble':
        out = h.bubbleText(s);
        break;
      case 'upsidedown':
        out = h.upsideDown(s);
        break;
      case 'novowels':
        out = s.replace(/[aeiou]/gi, '');
        break;
      case 'vowels':
        out = (s.match(/[aeiou]/gi) || []).join('');
        break;
      case 'nodigits':
        out = s.replace(/\d/g, '');
        break;
      case 'digits':
        out = (s.match(/\d/g) || []).join('');
        break;
      case 'letters':
        out = (s.match(/[a-zA-Z]/g) || []).join('');
        break;
      case 'nospaces':
        out = s.replace(/\s+/g, '');
        break;
      case 'nosymbols':
        out = s.replace(/[^a-zA-Z0-9 ]/g, '');
        break;
      case 'firstword':
        out = h.words(s)[0] || '';
        break;
      case 'lastword':
        out = h.words(s).at(-1) || '';
        break;
      case 'firstchar':
        out = [...s][0] || '';
        break;
      case 'lastchar':
        out = [...s].at(-1) || '';
        break;
      case 'wrap40':
        out = s.match(/.{1,40}/g)?.join('\n') || '';
        break;
      case 'wrap60':
        out = s.match(/.{1,60}/g)?.join('\n') || '';
        break;
      case 'wrap80':
        out = s.match(/.{1,80}/g)?.join('\n') || '';
        break;
      case 'rot13':
        out = h.rot13(s);
        break;
      case 'morse':
        out = h.morseEncode(s);
        break;
      case 'demorse':
        out = h.morseDecode(s);
        break;
      case 'base64':
      case 'base64text':
        out = Buffer.from(s, 'utf8').toString('base64');
        break;
      case 'hex':
      case 'hextext':
        out = Buffer.from(s, 'utf8').toString('hex');
        break;
      case 'unicode':
        out = [...s].map(c => `U+${c.codePointAt(0).toString(16).toUpperCase()}`).join(' ');
        break;
      case 'charcodes':
        out = [...s].map(c => `${c}=${c.charCodeAt(0)}`).join('\n');
        break;
      case 'palindrome': {
        const z = s.toLowerCase().replace(/[^a-z0-9]/g, '');
        out = z === h.reverse(z) ? 'Yes, it is a palindrome.' : 'No, not a palindrome.';
        break;
      }
      case 'brackets':
        out = '【' + s + '】';
        break;
      case 'parentheses':
        out = '(' + s + ')';
        break;
      case 'quotes':
        out = '“' + s + '”';
        break;
      case 'backticks':
        out = '`' + s + '`';
        break;
      case 'slash':
      case 'slashify':
        out = [...s].join('/');
        break;
      case 'pipe':
      case 'pipeify':
        out = h.words(s).join(' | ');
        break;
      case 'comma':
      case 'commafy':
        out = h.words(s).join(', ');
        break;
      case 'countchars':
        out = `Characters: ${[...s].length}`;
        break;
      case 'countwords':
        out = `Words: ${h.words(s).length}`;
        break;
      case 'countlines':
        out = `Lines: ${s.split(/\r?\n/).length}`;
        break;
      case 'countvowels':
        out = `Vowels: ${(s.match(/[aeiou]/gi) || []).length}`;
        break;
      case 'countdigits':
        out = `Digits: ${(s.match(/\d/g) || []).length}`;
        break;
      case 'countspaces':
        out = `Spaces: ${(s.match(/\s/g) || []).length}`;
        break;
      case 'countupper':
        out = `Uppercase: ${(s.match(/[A-Z]/g) || []).length}`;
        break;
      case 'countlower':
        out = `Lowercase: ${(s.match(/[a-z]/g) || []).length}`;
        break;
      case 'numbersum':
        out = `Sum of digits: ${(s.match(/\d/g) || []).reduce((a, b) => a + Number(b), 0)}`;
        break;
      case 'nodupchars':
        out = [...new Set([...s])].join('');
        break;
      case 'repeat':
      case 'repeatword': {
        const count = Math.min(20, Math.max(1, Number(ctx.args[0]) || 1));
        const txt = ctx.args.slice(1).join(' ') || s;
        out = Array(count).fill(txt).join('\n');
        break;
      }
      case 'censor':
        out = s.replace(/[a-zA-Z]/g, '*');
        break;
      default:
        out = s;
    }
    return h.send(ctx, name.toUpperCase(), out);
  }, aliases, 'text');
}

function mathFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    const a = Number(ctx.args[0]), b = Number(ctx.args[1]);

    if (op === 'calc') {
      const expr = ctx.rest || '';
      if (!expr) return ctx.msg.reply(`Usage: ${config.prefix}calc <math-expression>\nExample: .calc (12+4)*5/2`);
      try {
        const result = h.evalMath(expr);
        return h.send(ctx, '🧮 CALCULATOR', `${expr} = ${result}`);
      } catch (err) {
        return ctx.msg.reply(`Calc Error: ${err.message}`);
      }
    }

    if (op === 'roll') {
      const arg = (ctx.args[0] || '6').toLowerCase();
      const match = arg.match(/^(\d+)d(\d+)$/);
      if (match) {
        const count = Math.min(20, Math.max(1, Number(match[1])));
        const sides = Math.max(2, Number(match[2]));
        const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
        const total = rolls.reduce((x, y) => x + y, 0);
        return h.send(ctx, '🎲 DICE ROLL', `${count}d${sides}: [${rolls.join(', ')}]\nTotal: ${total}`);
      }
      const sides = Math.max(2, Number(arg) || 6);
      return ctx.msg.reply(`🎲 Rolled (1-${sides}): ${Math.floor(Math.random() * sides) + 1}`);
    }

    if (op === 'genpass') {
      const len = Math.min(64, Math.max(6, Number(ctx.args[0]) || 16));
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}';
      let pass = '';
      for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
      return ctx.msg.reply(`🔑 Password (${len} chars):\n\`${pass}\``);
    }

    if (op === 'pct') {
      if (!Number.isFinite(a) || !Number.isFinite(b)) return ctx.msg.reply(`Usage: ${config.prefix}pct <percentage> <total>\nExample: .pct 20 500`);
      return ctx.msg.reply(`${a}% of ${b} = ${(a / 100) * b}`);
    }

    if (op === 'random') {
      const lo = Number.isFinite(a) ? a : 0, hi = Number.isFinite(b) ? b : 100;
      if (lo > hi) return ctx.msg.reply('Usage: .random min max');
      return ctx.msg.reply(String(Math.floor(Math.random() * (hi - lo + 1)) + lo));
    }
    if (op === 'dice') return ctx.msg.reply(String(Math.floor(Math.random() * 6) + 1));
    if (op === 'coin') return ctx.msg.reply(Math.random() < 0.5 ? 'Heads' : 'Tails');
    if (op === 'choose') {
      const opts = ctx.rest.split('|').map(x => x.trim()).filter(Boolean);
      return ctx.msg.reply(opts[Math.floor(Math.random() * opts.length)] || 'Usage: .choose option 1 | option 2');
    }
    if (op === 'sum' || op === 'avg' || op === 'min' || op === 'max') {
      const nums = ctx.args.map(Number).filter(Number.isFinite);
      if (!nums.length) return ctx.msg.reply('Provide numbers separated by space.');
      if (op === 'sum') return ctx.msg.reply(`Sum: ${nums.reduce((x, y) => x + y, 0)}`);
      if (op === 'avg') return ctx.msg.reply(`Average: ${nums.reduce((x, y) => x + y, 0) / nums.length}`);
      if (op === 'min') return ctx.msg.reply(`Minimum: ${Math.min(...nums)}`);
      return ctx.msg.reply(`Maximum: ${Math.max(...nums)}`);
    }

    const unary = { abs: Math.abs, sqrt: Math.sqrt, floor: Math.floor, ceil: Math.ceil, round: Math.round, sin: Math.sin, cos: Math.cos, tan: Math.tan, log: Math.log10 };
    if (unary[op]) return ctx.msg.reply(Number.isFinite(a) ? String(unary[op](a)) : 'Provide a number.');

    const binary = {
      add: (x, y) => x + y, sub: (x, y) => x - y, mul: (x, y) => x * y,
      div: (x, y) => y ? x / y : 'Cannot divide by zero',
      pow: (x, y) => x ** y, mod: (x, y) => x % y,
      percent: (x, y) => y ? (x / y) * 100 + '%' : 'NaN'
    };
    if (binary[op]) return ctx.msg.reply(Number.isFinite(a) && Number.isFinite(b) ? String(binary[op](a, b)) : 'Provide two numbers.');

    return ctx.msg.reply('Math command.');
  }, aliases, 'tools');
}

function convertFactory(name, op, unit, aliases = []) {
  return C(name, async ctx => {
    const x = Number(ctx.args[0]);
    if (!Number.isFinite(x)) return ctx.msg.reply(`Usage: ${config.prefix}${name} <number>`);
    const table = {
      c2f: x => x * 9 / 5 + 32, f2c: x => (x - 32) * 5 / 9,
      c2k: x => x + 273.15, k2c: x => x - 273.15,
      f2k: x => (x - 32) * 5 / 9 + 273.15, k2f: x => (x - 273.15) * 9 / 5 + 32,
      km2mi: x => x * 0.621371, mi2km: x => x / 0.621371,
      m2ft: x => x * 3.28084, ft2m: x => x / 3.28084,
      kg2lb: x => x * 2.20462262, lb2kg: x => x / 2.20462262,
      l2gal: x => x * 0.264172052, gal2l: x => x / 0.264172052,
      kmh2mph: x => x * 0.621371, mph2kmh: x => x / 0.621371,
      bytes2kb: x => x / 1024, kb2mb: x => x / 1024,
      mb2gb: x => x / 1024, gb2tb: x => x / 1024,
      sec2min: x => x / 60, min2sec: x => x * 60,
      min2hr: x => x / 60, hr2min: x => x * 60,
      day2hr: x => x * 24, hr2day: x => x / 24
    };
    const fn = table[op];
    return ctx.msg.reply(fn ? `${fn(x).toFixed(2)} ${unit}` : 'Conversion error.');
  }, aliases, 'tools');
}

function coreFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    switch (op) {
      case 'help': {
        const cat = (ctx.args[0] || '').toLowerCase();
        const page = Math.max(1, Number(ctx.args[1]) || 1);

        if (!cat) {
          const catEmoji = {
            core: '⚙️', account: '👤', chat: '💬',
            group: '👥', message: '📨', media: '🖼️',
            text: '🔤', tools: '🛠️', utility: '🔧', fun: '🎮'
          };
          const cats = [...new Set([...ctx.commands.values()].map(c => c.category))].sort();
          const lines = cats.map(c => {
            const emoji = catEmoji[c] || '📁';
            return emoji + ' | *' + c.toUpperCase() + '* : *`' + ctx.config.prefix + 'help ' + c + '`*';
          });
          const total = [...new Set([...ctx.commands.values()].map(c => c.name))].length;
          return h.send(ctx, 'Z A Y D X  S E L F B O T',
            'Total Commands: *' + total + '*\n\n' + lines.join('\n') +
            '\n\n_Use ' + ctx.config.prefix + 'help [category] [page] for command list_'
          );
        }

        const a = [...new Set([...ctx.commands.values()].map(c => c.name))]
          .filter(n => ctx.commands.get(n)?.category === cat).sort();
        const size = 50;
        const pages = Math.max(1, Math.ceil(a.length / size));
        const p = Math.min(page, pages);
        return h.send(ctx, cat.toUpperCase() + ' (' + p + '/' + pages + ')',
          a.length + ' commands\n\n' +
          a.slice((p - 1) * size, p * size).map(n => ctx.config.prefix + n).join('  ')
        );
      }
      case 'cmd': {
        const c = ctx.commands.get((ctx.args[0] || '').toLowerCase());
        return c
          ? h.send(ctx, ctx.config.prefix + c.name,
              'Category: ' + c.category + '\nAliases: ' + ((c.aliases || []).join(', ') || 'none'))
          : ctx.msg.reply('Command not found.');
      }
      case 'categories': {
        const cats = [...new Set([...ctx.commands.values()].map(c => c.category))].sort();
        return h.send(ctx, 'CATEGORIES', cats.join(' | '));
      }
      case 'ping': {
        const t = Date.now();
        const m = await ctx.msg.reply('Pong!');
        return m.edit?.(`Pong! ${Date.now() - t} ms`).catch(() => {});
      }
      case 'runtime': {
        const s = Math.floor((Date.now() - ctx.startedAt) / 1000);
        return h.send(ctx, 'UPTIME',
          Math.floor(s / 3600) + 'h ' + Math.floor((s % 3600) / 60) + 'm ' + (s % 60) + 's');
      }
      case 'status': {
        const s = Math.floor((Date.now() - ctx.startedAt) / 1000);
        const mem = process.memoryUsage();
        const state = await ctx.client.getState().catch(() => 'unknown');
        return h.send(ctx, 'SYSTEM STATUS',
          `State       : ${state}\n` +
          `Uptime      : ${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s\n` +
          `Commands    : ${ctx.commands.__canonicalCount}\n` +
          `Memory RSS  : ${h.bytes(mem.rss)}\n` +
          `Heap        : ${h.bytes(mem.heapUsed)} / ${h.bytes(mem.heapTotal)}\n` +
          `Node        : ${process.version} (${process.platform})`
        );
      }
      case 'state':
        return h.send(ctx, 'WA STATE', await ctx.client.getState().catch(() => 'unknown'));
      case 'count':
        return h.send(ctx, 'COMMAND COUNT',
          `Canonical: ${ctx.commands.__canonicalCount}\nTotal keys: ${ctx.commands.size}`);
      case 'about':
        return h.send(ctx, 'Z A Y D X  S E L F B O T',
          'High-performance WhatsApp personal automation client.\nBuilt with whatsapp-web.js • Deploy on Railway\n\ngithub.com/muhammadrayyan3472-del/whatsapp-selfbot');
      case 'prefix':
        return h.send(ctx, 'PREFIX', `Current prefix: \`${ctx.config.prefix}\``);
      case 'now':
        return h.send(ctx, 'NOW', new Date().toString());
      case 'date':
        return h.send(ctx, 'DATE', new Date().toLocaleDateString());
      case 'time':
        return h.send(ctx, 'TIME', new Date().toLocaleTimeString());
      case 'unix':
        return ctx.msg.reply(String(Math.floor(Date.now() / 1000)));
      case 'iso':
        return ctx.msg.reply(new Date().toISOString());
      case 'timezone':
        return ctx.msg.reply(ctx.config.timezone);
      case 'node':
        return ctx.msg.reply(process.version);
      case 'platform':
        return ctx.msg.reply(`${process.platform} ${process.arch}`);
      case 'pid':
        return ctx.msg.reply(String(process.pid));
      case 'cwd':
        return ctx.msg.reply(process.cwd());
      case 'memory': {
        const m = process.memoryUsage();
        return h.send(ctx, 'MEMORY',
          `RSS  : ${h.bytes(m.rss)}\nHeap : ${h.bytes(m.heapUsed)} / ${h.bytes(m.heapTotal)}`);
      }
      case 'restart':
        return ctx.msg.reply('Restart Node from terminal to reload modules.');
      case 'shutdown':
        await ctx.msg.reply('Shutting down selfbot...');
        return setTimeout(() => process.exit(0), 300);
      case 'echo':
        return ctx.msg.reply(ctx.rest || '');
      case 'debug':
        return ctx.msg.reply(`Command=${ctx.args[0] || 'none'} | Chat=${ctx.msg.from || ctx.msg.to} | Type=${ctx.msg.type}`);
      case 'version':
        return h.send(ctx, 'VERSION', 'Build 2.1.0 — Cleaned, optimized, UI styled.');
      default:
        return ctx.msg.reply('Core command.');
    }
  }, aliases, 'core');
}

function accountFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    const c = ctx.contact || await h.getContact(ctx);
    const i = ctx.client.info || {};
    switch (op) {
      case 'me':
        return h.send(ctx, 'MY ACCOUNT', `Name: ${h.safeName(c)}\nID: ${h.jidOf(c)}`);
      case 'name':
        return h.send(ctx, 'DISPLAY NAME', h.safeName(c));
      case 'bio':
        return h.send(ctx, 'BIO', c?.about || '(unavailable)');
      case 'profile':
        return ctx.msg.reply(await c?.getProfilePicUrl?.().catch(() => null) || 'No profile picture URL.');
      case 'setname':
        if (!ctx.rest) return ctx.msg.reply(`Usage: ${config.prefix}setname <Name>`);
        await ctx.client.setDisplayName(ctx.rest);
        return ctx.msg.reply('Display name updated.');
      case 'setbio':
        if (!ctx.rest) return ctx.msg.reply(`Usage: ${config.prefix}setbio <Status>`);
        await ctx.client.setStatus(ctx.rest);
        return ctx.msg.reply('Status updated.');
      case 'battery': {
        const b = await ctx.client.info?.getBatteryStatus?.().catch(() => null);
        return ctx.msg.reply(b ? `Battery: ${b.battery}% ${b.plugged ? '(charging)' : ''}` : 'Battery info unavailable.');
      }
      case 'device':
        return h.send(ctx, 'DEVICE', `Platform: ${i.platform || 'unknown'}\nPushname: ${i.pushname || 'unknown'}`);
      case 'number':
        return ctx.msg.reply(`Phone Number: ${String(i.wid?._serialized || i.wid?.$1 || i.wid || 'unknown')}`);
      case 'block':
        if (!c) return ctx.msg.reply('Contact unavailable.');
        await c.block();
        return ctx.msg.reply('Contact blocked.');
      case 'unblock':
        if (!c) return ctx.msg.reply('Contact unavailable.');
        await c.unblock();
        return ctx.msg.reply('Contact unblocked.');
      case 'business':
        return ctx.msg.reply(`Business Account: ${!!c?.isBusiness}`);
      case 'verified':
        return ctx.msg.reply(`Verified: ${!!c?.isVerified}`);
      case 'id':
        return ctx.msg.reply(`JID: ${h.jidOf(c)}`);
      case 'accountinfo':
        return h.send(ctx, 'ACCOUNT INFO',
          `Pushname : ${i.pushname || 'unknown'}\n` +
          `Platform : ${i.platform || 'unknown'}\n` +
          `WID      : ${i.wid?._serialized || i.wid?.$1 || 'unknown'}`
        );
      case 'logout':
        await ctx.msg.reply('Logging out from WhatsApp Web...');
        return ctx.client.logout().catch(e => ctx.msg.reply(`Logout error: ${e.message}`));
      case 'contactinfo': {
        const q = await h.getQuoted(ctx);
        const target = q ? await q.getContact() : c;
        if (!target) return ctx.msg.reply('Could not resolve contact.');
        return h.send(ctx, 'CONTACT INFO',
          `Name     : ${h.safeName(target)}\n` +
          `Number   : ${target.number || 'unknown'}\n` +
          `Business : ${!!target.isBusiness}\n` +
          `JID      : ${h.jidOf(target)}`
        );
      }
      default:
        return ctx.msg.reply('Account command.');
    }
  }, aliases, 'account');
}

function chatFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    const c = await h.requireChat(ctx);
    if (!c) return;

    switch (op) {
      case 'info':
        return h.send(ctx, 'CHAT INFO',
          `Name     : ${c.name || 'Unnamed'}\n` +
          `JID      : ${c.id?._serialized || c.id?.$1 || ''}\n` +
          `Group    : ${!!c.isGroup}\n` +
          `Unread   : ${c.unreadCount ?? 0}\n` +
          `Muted    : ${!!c.isMuted}\n` +
          `Pinned   : ${!!c.pinned}\n` +
          `Archived : ${!!c.archived}`
        );
      case 'archive':
        await c.archive();
        return ctx.msg.reply('Chat archived.');
      case 'unarchive':
        await c.unarchive();
        return ctx.msg.reply('Chat unarchived.');
      case 'mute': {
        const mins = Number(ctx.args[0]) || 60;
        await c.mute(new Date(Date.now() + mins * 60000));
        return ctx.msg.reply(`Chat muted for ${mins} minutes.`);
      }
      case 'unmute':
        await c.unmute();
        return ctx.msg.reply('Chat unmuted.');
      case 'pin':
        await c.pin();
        return ctx.msg.reply('Chat pinned.');
      case 'unpin':
        await c.unpin();
        return ctx.msg.reply('Chat unpinned.');
      case 'read':
        await c.sendSeen().catch(() => {});
        return ctx.msg.reply('Marked as read.');
      case 'unread':
        await c.markUnread().catch(() => {});
        return ctx.msg.reply('Marked as unread.');
      case 'clear':
        await c.clearMessages().catch(() => {});
        return ctx.msg.reply('Chat cleared.');
      case 'last': {
        const msgs = await c.fetchMessages({ limit: 1 }).catch(() => []);
        const m = msgs[0];
        return ctx.msg.reply(m ? `${m.fromMe ? 'Me' : 'Them'}: ${m.body || `[${m.type}]`}` : 'No messages found.');
      }
      case 'history': {
        const n = Math.min(30, Math.max(1, Number(ctx.args[0]) || 5));
        const msgs = await c.fetchMessages({ limit: n }).catch(() => []);
        return ctx.msg.reply(
          msgs.map(m => `${m.fromMe ? 'Me' : 'Them'}: ${m.body || `[${m.type}]`}`).join('\n') || 'No messages.'
        );
      }
      case 'fetch': {
        const n = Math.min(100, Math.max(1, Number(ctx.args[0]) || 20));
        const ms = await c.fetchMessages({ limit: n }).catch(() => []);
        return ctx.msg.reply(`Fetched ${ms.length} messages.`);
      }
      case 'id':
        return ctx.msg.reply(String(c.id?._serialized || c.id?.$1 || ctx.msg.from || ctx.msg.to));
      case 'name':
        return ctx.msg.reply(c.name || 'Unnamed');
      case 'isgroup':
        return ctx.msg.reply(`Is group: ${!!c.isGroup}`);
      case 'unreadcount':
        return ctx.msg.reply(`Unread count: ${c.unreadCount ?? 0}`);
      case 'archived':
        return ctx.msg.reply(`Archived: ${!!c.archived}`);
      case 'pinned':
        return ctx.msg.reply(`Pinned: ${!!c.pinned}`);
      case 'muted':
        return ctx.msg.reply(`Muted: ${!!c.isMuted}`);
      case 'sendtext':
        if (!ctx.rest) return ctx.msg.reply(`Usage: ${config.prefix}sendtext <message>`);
        await ctx.client.sendMessage(c.id?._serialized || c.id?.$1, ctx.rest);
        return ctx.msg.reply('Sent.');
      case 'listchats': {
        const chats = await ctx.client.getChats().catch(() => []);
        const top = chats.slice(0, 15);
        return h.send(ctx, `CHATS (${top.length})`,
          top.map((x, i) => `${i + 1}. ${x.name || 'Unnamed'} ${x.isGroup ? '👥' : '👤'} ${x.unreadCount ? `(${x.unreadCount} unread)` : ''}`).join('\n') || 'No chats.'
        );
      }
      case 'groups': {
        const chats = await ctx.client.getChats().catch(() => []);
        const gps = chats.filter(x => x.isGroup).slice(0, 20);
        return h.send(ctx, `GROUPS (${gps.length})`,
          gps.map((x, i) => `${i + 1}. ${x.name || 'Unnamed'} (${x.participants?.length || '?'} members)`).join('\n') || 'No groups found.'
        );
      }
      case 'privatechats': {
        const chats = await ctx.client.getChats().catch(() => []);
        const dms = chats.filter(x => !x.isGroup).slice(0, 15);
        return h.send(ctx, `DIRECT CHATS (${dms.length})`,
          dms.map((x, i) => `${i + 1}. ${x.name || 'Unnamed'}`).join('\n') || 'No direct chats found.'
        );
      }
      case 'contact': {
        const contact = await c.getContact().catch(() => null);
        return ctx.msg.reply(contact ? `Contact: ${h.safeName(contact)} (${contact.number || 'unknown'})` : 'Contact unavailable.');
      }
      default:
        return ctx.msg.reply('Chat command.');
    }
  }, aliases, 'chat');
}

function groupFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    const c = await h.requireChat(ctx);
    if (!c?.isGroup) return ctx.msg.reply('This command only works in groups.');

    switch (op) {
      case 'info':
        return h.send(ctx, 'GROUP INFO',
          `Name        : ${c.name}\n` +
          `JID         : ${c.id?._serialized || c.id?.$1}\n` +
          `Members     : ${c.participants?.length || 0}\n` +
          `Description : ${c.description || '(none)'}`
        );
      case 'name':
        return ctx.msg.reply(`Group Name: ${c.name}`);
      case 'setname':
        if (!ctx.rest) return ctx.msg.reply(`Usage: ${config.prefix}setgroupname <Name>`);
        await c.setSubject(ctx.rest);
        return ctx.msg.reply('Group name updated.');
      case 'desc':
        return ctx.msg.reply(`Description: ${c.description || '(none)'}`);
      case 'setdesc':
        await c.setDescription(ctx.rest || '');
        return ctx.msg.reply('Group description updated.');
      case 'members':
        return h.send(ctx, `MEMBERS (${c.participants.length})`,
          c.participants.slice(0, 50).map(p => `${p.isAdmin || p.isSuperAdmin ? '👑' : '•'} ${p.id?._serialized || p.id?.$1}`).join('\n') +
          (c.participants.length > 50 ? `\n...and ${c.participants.length - 50} more.` : '')
        );
      case 'membercount':
        return ctx.msg.reply(`Member count: ${c.participants.length}`);
      case 'admins':
        return h.send(ctx, 'GROUP ADMINS',
          c.participants.filter(p => p.isAdmin || p.isSuperAdmin).map(p => `👑 ${p.id?._serialized || p.id?.$1}`).join('\n') || 'None'
        );
      case 'promote': {
        const q = await h.getQuoted(ctx);
        const id = q?.author || q?.from || ctx.args[0];
        if (!id) return ctx.msg.reply('Reply to a member or provide their phone number/JID.');
        await c.promoteParticipants([id.includes('@') ? id : `${id.replace(/\D/g, '')}@c.us`]);
        return ctx.msg.reply('Member promoted to admin.');
      }
      case 'demote': {
        const q = await h.getQuoted(ctx);
        const id = q?.author || q?.from || ctx.args[0];
        if (!id) return ctx.msg.reply('Reply to a member or provide their phone number/JID.');
        await c.demoteParticipants([id.includes('@') ? id : `${id.replace(/\D/g, '')}@c.us`]);
        return ctx.msg.reply('Member demoted.');
      }
      case 'add': {
        const n = (ctx.args[0] || '').replace(/\D/g, '');
        if (!n) return ctx.msg.reply(`Usage: ${config.prefix}addmember <phone-number>`);
        await c.addParticipants([n + '@c.us']);
        return ctx.msg.reply(`Added ${n}.`);
      }
      case 'remove': {
        const q = await h.getQuoted(ctx);
        const id = q?.author || q?.from || ctx.args[0];
        if (!id) return ctx.msg.reply('Reply to a member or provide a phone number/JID.');
        await c.removeParticipants([id.includes('@') ? id : `${id.replace(/\D/g, '')}@c.us`]);
        return ctx.msg.reply('Member removed.');
      }
      case 'leave':
        await ctx.msg.reply('Leaving group...');
        return c.leave();
      case 'invite':
        return ctx.msg.reply(`Invite Link: https://chat.whatsapp.com/${await c.getInviteCode()}`);
      case 'revoke':
        await c.revokeInvite();
        return ctx.msg.reply('Invite link revoked.');
      case 'lock':
        await c.setMessagesAdminsOnly(true);
        return ctx.msg.reply('Group locked: Only admins can send messages.');
      case 'unlock':
        await c.setMessagesAdminsOnly(false);
        return ctx.msg.reply('Group unlocked: All members can send messages.');
      case 'infolock':
        await c.setInfoAdminsOnly(true);
        return ctx.msg.reply('Group info locked: Only admins can edit group info.');
      case 'infounlock':
        await c.setInfoAdminsOnly(false);
        return ctx.msg.reply('Group info unlocked: All members can edit group info.');
      case 'id':
        return ctx.msg.reply(`Group ID: ${c.id?._serialized || c.id?.$1}`);
      case 'owner':
        return ctx.msg.reply(`Group Owner: ${c.owner?._serialized || c.owner?.$1 || 'unknown'}`);
      case 'stats':
        return ctx.msg.reply(`Members: ${c.participants.length} | Admins: ${c.participants.filter(p => p.isAdmin || p.isSuperAdmin).length}`);
      case 'read':
        await c.sendSeen().catch(() => {});
        return ctx.msg.reply('Marked group as read.');
      case 'mentions':
      case 'tagall': {
        const text = ctx.rest ? `*Announcement:*\n${ctx.rest}\n\n` : '*Attention Everyone:*\n\n';
        const mentions = c.participants.map(p => p.id?._serialized || p.id?.$1);
        const body = text + c.participants.map(p => `@${String(p.id?._serialized || p.id?.$1).split('@')[0]}`).join(' ');
        await ctx.client.sendMessage(c.id?._serialized || c.id?.$1, body, { mentions });
        return;
      }
      case 'grouprules': {
        const rules = store.get(`rules_${c.id?._serialized || c.id?.$1}`, 'No rules set for this group.');
        return h.send(ctx, 'GROUP RULES', rules);
      }
      case 'setgrouprules': {
        if (!ctx.rest) return ctx.msg.reply(`Usage: ${config.prefix}setgrouprules <rules text>`);
        store.set(`rules_${c.id?._serialized || c.id?.$1}`, ctx.rest);
        return ctx.msg.reply('Group rules saved.');
      }
      default:
        return ctx.msg.reply('Group command.');
    }
  }, aliases, 'group');
}

function messageFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    if (op === 'snipe' || op === 'snipeall') {
      const a = (ctx.client.__snipeCache?.get(ctx.msg.from || ctx.msg.to) || []).filter(x => Date.now() - x.deletedAt < 600000);
      if (op === 'snipe') return ctx.msg.reply(a.length ? `📝 Deleted: ${a.at(-1).body}` : 'No recently deleted message captured.');
      return ctx.msg.reply(a.map(x => '• ' + x.body).join('\n') || 'No deleted messages.');
    }

    if (op === 'messageid') return ctx.msg.reply(String(ctx.msg.id?._serialized || ctx.msg.id?.$1 || ctx.msg.id));
    if (op === 'type') return ctx.msg.reply(`Type: ${ctx.msg.type || 'chat'}`);
    if (op === 'author') return ctx.msg.reply(`Author: ${ctx.msg.author || ctx.msg.from || 'unknown'}`);
    if (op === 'bodylength') return ctx.msg.reply(`Length: ${(ctx.msg.body || '').length}`);
    if (op === 'wordcount') return ctx.msg.reply(`Words: ${h.words(ctx.msg.body).length}`);
    if (op === 'charcount') return ctx.msg.reply(`Characters: ${[...(ctx.msg.body || '')].length}`);
    if (op === 'messagetime') return ctx.msg.reply(new Date((ctx.msg.timestamp || Math.floor(Date.now() / 1000)) * 1000).toString());
    if (op === 'hasmedia') {
      const q = await h.getQuoted(ctx);
      return ctx.msg.reply(`Has media: ${!!q?.hasMedia}`);
    }

    const q = await h.requireQuoted(ctx);
    if (!q) return;

    if (op === 'quotedid') return ctx.msg.reply(String(q.id?._serialized || q.id?.$1 || q.id));
    if (op === 'quotedauthor') return ctx.msg.reply(`Author: ${q.author || q.from || 'unknown'}`);
    if (op === 'quotedtype') return ctx.msg.reply(`Type: ${q.type || 'unknown'}`);
    if (op === 'quotedbody') return ctx.msg.reply(q.body || '(no text content)');
    if (op === 'quote') return ctx.msg.reply(`> "${q.body || `[${q.type || 'media'}]`}"`);
    if (op === 'copy') return ctx.msg.reply(q.body || `[${q.type}]`);
    if (op === 'react') {
      const emoji = ctx.args[0] || '👍';
      await q.react(emoji);
      return ctx.msg.reply(`Reacted with ${emoji}`);
    }
    if (op === 'star') {
      await q.star();
      return ctx.msg.reply('Message starred.');
    }
    if (op === 'unstar') {
      await q.unstar();
      return ctx.msg.reply('Message unstarred.');
    }
    if (op === 'isstarred') return ctx.msg.reply(`Is starred: ${!!q.isStarred}`);
    if (op === 'delete') {
      await q.delete(true).catch(() => q.delete()).catch(() => {});
      return ctx.msg.reply('Message deleted.');
    }
    if (op === 'forward') {
      await q.forward(ctx.msg.from);
      return ctx.msg.reply('Message forwarded.');
    }
    if (op === 'mentionme') {
      const author = ctx.msg.author || ctx.msg.from;
      await ctx.client.sendMessage(ctx.msg.from, `@${author.split('@')[0]}`, { mentions: [author] });
      return;
    }

    return ctx.msg.reply('Message command.');
  }, aliases, 'message');
}

function mediaFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    if (op === 'sendfile' || op === 'sendimage' || op === 'sendvideo' || op === 'sendaudio' || op === 'senddocument') {
      const fs = require('fs');
      const { MessageMedia } = require('whatsapp-web.js');
      const f = ctx.args[0] || ctx.rest;
      if (!f || !fs.existsSync(f)) return ctx.msg.reply(`Usage: ${config.prefix}${name} <full-file-path>`);
      try {
        await ctx.client.sendMessage(
          ctx.msg.from || ctx.msg.to,
          MessageMedia.fromFilePath(f),
          (name === 'sendimage' || name === 'sendvideo') ? { caption: ctx.args.slice(1).join(' ') } : {}
        );
        return ctx.msg.reply('Media sent.');
      } catch (e) {
        return ctx.msg.reply('Send failed: ' + e.message);
      }
    }

    if (op === 'mediafolder') return ctx.msg.reply(require('path').join(process.cwd(), 'downloads'));

    const q = await h.getQuoted(ctx);

    if (op === 'hasmedia') return ctx.msg.reply(`Has media: ${!!q?.hasMedia}`);

    if (op === 'info' || op === 'type' || op === 'mimetype' || op === 'filename' || op === 'mediaid' || op === 'mediaauthor') {
      if (!q?.hasMedia) return ctx.msg.reply('Reply to a media message.');
      if (op === 'mediaid') return ctx.msg.reply(String(q.id?._serialized || q.id?.$1 || q.id));
      if (op === 'mediaauthor') return ctx.msg.reply(String(q.author || q.from || 'unknown'));
      if (op === 'info') return ctx.msg.reply(`Type: ${q.type}\nMIME: ${q._data?.mimetype || 'unknown'}\nFilename: ${q._data?.filename || 'unknown'}`);
      if (op === 'type') return ctx.msg.reply(`Media Type: ${q.type}`);
      if (op === 'mimetype') return ctx.msg.reply(`MIME: ${q._data?.mimetype || 'unknown'}`);
      return ctx.msg.reply(`Filename: ${q._data?.filename || 'unknown'}`);
    }

    if (op === 'save' || op === 'download') {
      const r = await h.downloadQuotedMedia(ctx, ctx.args[0] || 'media');
      return ctx.msg.reply(r ? `Media saved to:\n${r.out}` : 'Download failed or no media attached.');
    }

    if (op === 'sticker') {
      if (!q?.hasMedia) return ctx.msg.reply('Reply to an image or video to create a sticker.');
      try {
        const m = await q.downloadMedia();
        if (!m) return ctx.msg.reply('Media could not be downloaded.');
        await ctx.client.sendMessage(ctx.msg.from || ctx.msg.to, m, { sendMediaAsSticker: true });
        return;
      } catch (e) {
        return ctx.msg.reply('Sticker generation failed: ' + e.message);
      }
    }

    if (op === 'clearmedia') {
      const dir = require('path').join(process.cwd(), 'downloads');
      const fs = require('fs');
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) fs.unlinkSync(require('path').join(dir, file));
        return ctx.msg.reply(`Cleared ${files.length} downloaded files.`);
      }
      return ctx.msg.reply('Downloads folder is empty.');
    }

    return ctx.msg.reply('Media command.');
  }, aliases, 'media');
}

function utilityFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    if (op === 'note') {
      if (!ctx.rest) return ctx.msg.reply(`Usage: ${config.prefix}note <text>`);
      const n = store.notes(), id = Date.now().toString();
      n[id] = { text: ctx.rest, created: new Date().toISOString() };
      store.set('notes', n);
      return ctx.msg.reply(`Saved note #${id}`);
    }
    if (op === 'notes') {
      const n = store.notes();
      const entries = Object.entries(n);
      return h.send(ctx, 'YOUR NOTES',
        entries.length ? entries.map(([id, x]) => `• [${id}]: ${x.text}`).join('\n') : 'No notes saved.'
      );
    }
    if (op === 'findnote') {
      const q = ctx.rest.toLowerCase();
      if (!q) return ctx.msg.reply(`Usage: ${config.prefix}findnote <query>`);
      const matches = Object.entries(store.notes()).filter(([, x]) => x.text.toLowerCase().includes(q));
      return h.send(ctx, 'MATCHING NOTES',
        matches.length ? matches.map(([id, x]) => `• [${id}]: ${x.text}`).join('\n') : 'No matching notes found.'
      );
    }
    if (op === 'delnote') {
      const n = store.notes(), id = ctx.args[0];
      if (!n[id]) return ctx.msg.reply(`Usage: ${config.prefix}delnote <note-id>`);
      delete n[id];
      store.set('notes', n);
      return ctx.msg.reply(`Note #${id} deleted.`);
    }
    if (op === 'clearnotes') {
      store.set('notes', {});
      return ctx.msg.reply('All notes cleared.');
    }

    if (op === 'todo') {
      if (!ctx.rest) return ctx.msg.reply(`Usage: ${config.prefix}todo <task>`);
      const t = store.todos(), id = Date.now().toString();
      t[id] = { text: ctx.rest, done: false };
      store.set('todos', t);
      return ctx.msg.reply(`Added Todo #${id}`);
    }
    if (op === 'todos') {
      const t = store.todos();
      const entries = Object.entries(t);
      return h.send(ctx, 'YOUR TASKS',
        entries.length ? entries.map(([id, x]) => `${x.done ? '✅' : '⬜'} [${id}]: ${x.text}`).join('\n') : 'No tasks on your list.'
      );
    }
    if (op === 'donetodo') {
      const t = store.todos(), id = ctx.args[0];
      if (!t[id]) return ctx.msg.reply(`Usage: ${config.prefix}donetodo <id>`);
      t[id].done = true;
      store.set('todos', t);
      return ctx.msg.reply(`Task #${id} marked as done.`);
    }
    if (op === 'deltodo') {
      const t = store.todos(), id = ctx.args[0];
      if (!t[id]) return ctx.msg.reply(`Usage: ${config.prefix}deltodo <id>`);
      delete t[id];
      store.set('todos', t);
      return ctx.msg.reply(`Task #${id} removed.`);
    }
    if (op === 'cleartodos') {
      store.set('todos', {});
      return ctx.msg.reply('All tasks cleared.');
    }

    if (op === 'remind' || op === 'schedule') {
      const ms = h.parseDuration(ctx.args[0]), text = ctx.args.slice(1).join(' ');
      if (!ms || !text) return ctx.msg.reply(`Usage: ${config.prefix}${name} <10m|1h|30s> <reminder-text>`);
      setTimeout(() => {
        ctx.client.sendMessage(ctx.msg.from || ctx.msg.to, `⏰ *Reminder:* ${text}`);
      }, ms);
      return ctx.msg.reply(`Reminder scheduled in ${ctx.args[0]}.`);
    }

    if (op === 'afk') {
      store.set('afk', { enabled: true, reason: ctx.rest || 'AFK', since: Date.now() });
      return ctx.msg.reply(`AFK mode enabled: "${ctx.rest || 'AFK'}"`);
    }
    if (op === 'unafk') {
      store.set('afk', { enabled: false });
      return ctx.msg.reply('AFK mode disabled.');
    }

    if (op === 'weather') {
      const city = encodeURIComponent(ctx.rest || 'Karachi');
      try {
        const res = await fetch(`https://wttr.in/${city}?format=3`, { signal: AbortSignal.timeout(6000) });
        const text = await res.text();
        return h.send(ctx, '🌤️ WEATHER', text.trim());
      } catch {
        return ctx.msg.reply('Weather lookup timed out or unavailable.');
      }
    }

    if (op === 'wiki') {
      const query = ctx.rest.trim();
      if (!query) return ctx.msg.reply(`Usage: ${config.prefix}wiki <topic>`);
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(6000) });
        const j = await res.json();
        if (j.extract) {
          return h.send(ctx, '📖 ' + j.title.toUpperCase(), j.extract + '\n\n' + (j.content_urls?.desktop?.page || ''));
        }
        return ctx.msg.reply('No Wikipedia page found for this topic.');
      } catch {
        return ctx.msg.reply('Wikipedia lookup unavailable.');
      }
    }

    if (op === 'github') {
      const user = ctx.args[0];
      if (!user) return ctx.msg.reply(`Usage: ${config.prefix}github <username>`);
      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`, {
          headers: { 'User-Agent': 'WhatsAppSelfbot' },
          signal: AbortSignal.timeout(6000)
        });
        const j = await res.json();
        if (j.login) {
          return h.send(ctx, '🐙 GITHUB: ' + j.login.toUpperCase(),
            `Name    : ${j.name || 'None'}\n` +
            `Bio     : ${j.bio || 'None'}\n` +
            `Repos   : ${j.public_repos}\n` +
            `Follows : ${j.followers} followers / ${j.following} following\n` +
            j.html_url
          );
        }
        return ctx.msg.reply('GitHub user not found.');
      } catch {
        return ctx.msg.reply('GitHub API lookup failed.');
      }
    }

    if (op === 'poll') {
      const parts = ctx.rest.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length < 3) return ctx.msg.reply(`Usage: ${config.prefix}poll Question | Option 1 | Option 2`);
      const [q, ...opts] = parts;
      const body = `📊 *Poll:* ${q}\n\n` + opts.map((opt, i) => `${i + 1}. ⬜ ${opt}`).join('\n');
      return ctx.msg.reply(body);
    }

    if (op === 'crypto') {
      const coin = (ctx.args[0] || 'btc').toLowerCase();
      const map = {
        btc: 'bitcoin', eth: 'ethereum', bnb: 'binancecoin', sol: 'solana',
        xrp: 'ripple', doge: 'dogecoin', ada: 'cardano', trx: 'tron',
        ltc: 'litecoin', avax: 'avalanche-2', link: 'chainlink'
      };
      const id = map[coin] || coin;
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`, { signal: AbortSignal.timeout(6000) });
        const j = await res.json();
        if (j[id]?.usd != null) return h.send(ctx, '💰 CRYPTO', `${coin.toUpperCase()} = ${j[id].usd} USD`);
        return ctx.msg.reply(`Price for "${coin}" not found.`);
      } catch {
        return ctx.msg.reply('Crypto price lookup failed.');
      }
    }

    if (op === 'ip') {
      const dns = require('dns').promises;
      const host = ctx.rest.trim();
      if (!host) return ctx.msg.reply(`Usage: ${config.prefix}ip <domain>`);
      try {
        const r = await dns.lookup(host, { all: true });
        return ctx.msg.reply(`IP for ${host}:\n` + r.map(x => `• ${x.address} (${x.family === 4 ? 'IPv4' : 'IPv6'})`).join('\n'));
      } catch {
        return ctx.msg.reply('DNS lookup failed.');
      }
    }

    if (op === 'json') {
      try {
        return ctx.msg.reply(JSON.stringify(JSON.parse(ctx.rest), null, 2));
      } catch {
        return ctx.msg.reply('Invalid JSON.');
      }
    }

    if (op === 'b64') return ctx.msg.reply(Buffer.from(ctx.rest, 'utf8').toString('base64'));
    if (op === 'b64d') {
      try { return ctx.msg.reply(Buffer.from(ctx.rest, 'base64').toString('utf8')); } catch { return ctx.msg.reply('Invalid base64.'); }
    }
    if (op === 'hash') return ctx.msg.reply(h.hash('sha256', ctx.rest));
    if (op === 'sha1') return ctx.msg.reply(h.hash('sha1', ctx.rest));
    if (op === 'sha256') return ctx.msg.reply(h.hash('sha256', ctx.rest));
    if (op === 'sha512') return ctx.msg.reply(h.hash('sha512', ctx.rest));
    if (op === 'md5') return ctx.msg.reply(h.hash('md5', ctx.rest));
    if (op === 'uuid') return ctx.msg.reply(require('crypto').randomUUID());
    if (op === 'bytes') return ctx.msg.reply(h.bytes(ctx.args[0]));
    if (op === 'choose') {
      const a = ctx.rest.split('|').map(s => s.trim()).filter(Boolean);
      return ctx.msg.reply(a[Math.floor(Math.random() * a.length)] || 'Use: .choose a | b');
    }
    if (op === 'randomcolor') return ctx.msg.reply('#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'));
    if (op === 'timestamp') return ctx.msg.reply(String(Math.floor(Date.now() / 1000)));

    if (op === 'today') return ctx.msg.reply(new Date().toLocaleDateString());
    if (op === 'tomorrow') return ctx.msg.reply(new Date(Date.now() + 86400000).toLocaleDateString());
    if (op === 'yesterday') return ctx.msg.reply(new Date(Date.now() - 86400000).toLocaleDateString());
    if (op === 'month') return ctx.msg.reply(new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' }));
    if (op === 'year') return ctx.msg.reply(String(new Date().getFullYear()));
    if (op === 'daysleft') {
      const end = new Date(new Date().getFullYear(), 11, 31);
      return ctx.msg.reply(`Days left in year: ${Math.ceil((end - Date.now()) / 86400000)}`);
    }

    if (op === 'settings') return ctx.msg.reply(JSON.stringify(store.get('settings', {}), null, 2));
    if (op === 'setsetting') {
      const k = ctx.args[0], v = ctx.args.slice(1).join(' ');
      if (!k) return ctx.msg.reply('Usage: .setsetting key value');
      const d = store.get('settings', {});
      d[k] = v;
      store.set('settings', d);
      return ctx.msg.reply(`Setting "${k}" saved.`);
    }
    if (op === 'getsetting') return ctx.msg.reply(String(store.get('settings', {})[ctx.args[0]] ?? 'Not set'));
    if (op === 'delsetting') {
      const d = store.get('settings', {});
      delete d[ctx.args[0]];
      store.set('settings', d);
      return ctx.msg.reply('Setting removed.');
    }

    return ctx.msg.reply('Utility command.');
  }, aliases, 'utility');
}

function funFactory(name, op, aliases = []) {
  return C(name, async ctx => {
    const pools = {
      joke: [
        'Why do programmers prefer dark mode? Because light attracts bugs.',
        'I would tell you a UDP joke, but you might not get it.',
        'There are 10 types of people in the world: those who understand binary, and those who don’t.',
        'A SQL query walks into a bar, walks up to two tables and asks: "Can I join you?"',
        'Programming is 10% coding and 90% figuring out why it doesn’t work.'
      ],
      quote: [
        'Keep building.',
        'Small consistent steps compound into greatness.',
        'Curiosity is a developer superpower.',
        'First make it work, then make it right, then make it fast.'
      ],
      compliment: [
        'Your debugging instincts are top notch!',
        'You have sharp problem-solving energy.',
        'You build things that matter.',
        'Solid work, keep it up!'
      ],
      fact: [
        'Octopuses have three hearts and blue blood.',
        'A day on Venus is longer than its entire year.',
        'Bananas are botanically berries, but strawberries are not.',
        'Honey never spoils; archaeologists found 3,000-year-old edible honey.'
      ],
      roast: [
        'You have an entire lifetime to be yourself, why start now?',
        'Your code looks like it was written by an infinite number of monkeys with no coffee.',
        'I’d agree with you, but then we’d both be wrong.',
        'You bring everyone so much joy... when you leave the room.'
      ],
      riddle: [
        'What has keys but cannot open locks? (A piano)',
        'What gets wetter the more it dries? (A towel)',
        'What has a head and a tail, but no body? (A coin)',
        'What can travel around the world while staying in a corner? (A postage stamp)'
      ],
      emoji: ['😀','😂','😎','🔥','🤖','👀','🎯','⚡','🚀','💀','👑','💯'],
      mood: ['😎 chill', '🔥 hyped', '🤖 focused', '😴 sleepy', '🎯 locked in', '☕ caffeinated']
    };

    if (op === '8ball') {
      const answers = ['Yes, definitely.', 'Outlook good.', 'Most likely.', 'Ask again later.', 'Cannot predict now.', 'Don’t count on it.', 'My sources say no.', 'Very doubtful.'];
      return h.send(ctx, '🎱 8BALL', answers[Math.floor(Math.random() * answers.length)]);
    }
    if (op === 'rate') return h.send(ctx, 'RATING', `${Math.floor(Math.random() * 101)}/100`);
    if (op === 'yesno') return ctx.msg.reply(Math.random() < 0.5 ? '✅ Yes' : '❌ No');
    if (op === 'rps') {
      const opts = ['rock', 'paper', 'scissors'], u = (ctx.args[0] || '').toLowerCase();
      if (!opts.includes(u)) return ctx.msg.reply(`Usage: ${config.prefix}rps <rock|paper|scissors>`);
      const b = opts[Math.floor(Math.random() * 3)];
      const w = u === b ? 'Draw!' : ((u === 'rock' && b === 'scissors') || (u === 'paper' && b === 'rock') || (u === 'scissors' && b === 'paper')) ? 'You win! 🎉' : 'Bot wins! 🤖';
      return ctx.msg.reply(`You: ${u}\nBot: ${b}\nOutcome: ${w}`);
    }
    if (op === 'wyr') {
      const [a, b] = ctx.rest.split('|').map(x => x.trim());
      return ctx.msg.reply(a && b ? `Would you rather: ${Math.random() < 0.5 ? a : b}!` : `Usage: ${config.prefix}wyr Option A | Option B`);
    }
    if (op === 'dicegame') {
      const a = Math.floor(Math.random() * 6) + 1, b = Math.floor(Math.random() * 6) + 1;
      return ctx.msg.reply(`🎲 You: ${a} | Bot: ${b}\n${a > b ? 'You win!' : a < b ? 'Bot wins!' : 'Draw!'}`);
    }
    if (op === 'love') {
      const n1 = ctx.args[0] || 'Person 1', n2 = ctx.args[1] || 'Person 2';
      const pct = Math.floor(Math.random() * 101);
      return h.send(ctx, '❤️ LOVE METER', `${n1} & ${n2} = ${pct}%`);
    }
    if (op === 'randomnumber') {
      const max = Math.max(1, Number(ctx.args[0]) || 100);
      return ctx.msg.reply(String(Math.floor(Math.random() * max) + 1));
    }
    if (op === 'randomletter') return ctx.msg.reply(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
    if (op === 'randomname') {
      const names = ['Rayyan', 'Alex', 'Nova', 'Leo', 'Zayn', 'Maya', 'Aria', 'Sam', 'Kai'];
      return ctx.msg.reply(names[Math.floor(Math.random() * names.length)]);
    }
    if (op === 'randomtime') {
      const h = String(Math.floor(Math.random() * 24)).padStart(2, '0');
      const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      return ctx.msg.reply(`${h}:${m}`);
    }
    if (op === 'randomdate') {
      const d = new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000);
      return ctx.msg.reply(d.toLocaleDateString());
    }
    if (op === 'clap') return ctx.msg.reply(ctx.rest.split(/\s+/).join(' 👏 '));
    if (op === 'party') return ctx.msg.reply(ctx.rest ? `🎉 ${ctx.rest} 🎉` : '🎉 🥳 🎊');
    if (op === 'boom') return ctx.msg.reply(ctx.rest ? `💥 ${ctx.rest} 💥` : '💥 BOOM!');
    if (op === 'ascii') {
      const arts = {
        shrug: '¯\\_(ツ)_/¯', lenny: '( ͡° ͜ʖ ͡°)', tableflip: '(╯°□°)╯︵ ┻━┻',
        unflip: '┬─┬ノ( º _ ºノ)', bear: 'ʕ•ᴥ•ʔ', happy: '( ﾟヮﾟ)', cry: '(╥﹏╥)'
      };
      const key = (ctx.args[0] || 'shrug').toLowerCase();
      return ctx.msg.reply(arts[key] || arts.shrug);
    }

    const arr = pools[op] || ['Fun command.'];
    return h.send(ctx, op.toUpperCase(), arr[Math.floor(Math.random() * arr.length)]);
  }, aliases, 'fun');
}

module.exports = {
  C,
  textFactory,
  mathFactory,
  convertFactory,
  coreFactory,
  accountFactory,
  chatFactory,
  groupFactory,
  messageFactory,
  mediaFactory,
  utilityFactory,
  funFactory
};
