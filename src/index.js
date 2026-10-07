process.on('unhandledRejection', (reason) => {
  console.warn('[UNHANDLED REJECTION]', reason?.message || reason);
});
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err?.message || err);
});

const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const config = require('./core/config');
const { parseArgs } = require('./core/context');
const { loadCommands } = require('./core/loader');
const h = require('./core/helpers');
const { normalizeId } = h;

const phone = (process.env.PHONE_NUMBER || '').replace(/\D/g, '');
const pairing = process.env.PAIRING_CODE !== 'false' && !!phone;

const puppeteerArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-gpu'
];

const puppeteerConfig = {
  headless: true,
  args: puppeteerArgs
};

if (process.env.PUPPETEER_EXECUTABLE_PATH) {
  puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
}

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: config.authDir }),
  puppeteer: puppeteerConfig,
  deviceName: 'WA Personal Selfbot',
  browserName: 'Chrome'
});

const commands = loadCommands(path.join(__dirname, 'commands'));
const startedAt = Date.now();

function showCodeBox(code) {
  const codeBox = [
    `[+]================================] | [ PAIRING CODE ] | [================================[+]`,
    `[-]                         >>>  ${code}  <<<                         [-]`,
    `[+]========================================================================================[+]`
  ].join('\n');
  console.log('\n' + h.gradient(codeBox) + '\n');
}

client.on('code', code => {
  showCodeBox(code);
});

let pairingAttempted = false;
client.on('qr', async qr => {
  if (pairing && !pairingAttempted) {
    pairingAttempted = true;
    console.log(`\n\x1b[36m[PAIRING] Page ready. Requesting pairing code for +${phone}...\x1b[0m`);
    await new Promise(r => setTimeout(r, 3000));
    try {
      const code = await client.requestPairingCode(phone, true, 180000);
      if (code) showCodeBox(code);
    } catch (err) {
      console.warn(`\n\x1b[33m[PAIRING NOTICE] Pairing code request failed (${err?.message || err}).\x1b[0m`);
      console.log('\x1b[32m[BACKUP QR] Displaying QR code below (Scan with WhatsApp -> Linked Devices -> Link a device):\x1b[0m\n');
      try {
        require('qrcode-terminal').generate(qr, { small: true });
      } catch {}
      setTimeout(() => { pairingAttempted = false; }, 60000);
    }
  } else if (!pairing) {
    console.log('[QR] Scan with WhatsApp -> Linked Devices:');
    try {
      require('qrcode-terminal').generate(qr, { small: true });
    } catch {}
  }
});

client.on('authenticated', () => console.log('\x1b[32m[AUTH] Successfully authenticated!\x1b[0m'));

client.on('ready', async () => {
  try { console.clear(); } catch {}
  const userName = client.info?.pushname || client.info?.wid?.user || phone || 'ZAYDX User';
  const banner = [
    `[+]================================] | [ Z A Y D X ] | [================================[+]`,
    `[+]================================] | [ S E L F B O T ] | [================================[+]`,
    `[-]================================] | [ ${userName} ] | [================================[-]`,
    `[-]================================] | [ CMDS : ${commands.__canonicalCount} ] | [================================[-]`
  ];

  for (const line of banner) {
    console.log(h.gradient(line));
    await new Promise(r => setTimeout(r, 100));
  }
  console.log(`\n\x1b[32m[+] WhatsApp Selfbot Ready & Listening on Prefix: "${config.prefix}"\x1b[0m\n`);
});

client.on('auth_failure', e => console.error('[AUTH FAILURE]', e));
client.on('disconnected', r => console.log('[DISCONNECTED]', r));

const observed = new Map(), deleted = new Map(), TTL = 10 * 60 * 1000, MAX = 25;
client.__snipeCache = deleted;

function remember(m) {
  try {
    normalizeId(m?.id);
    if (!m?.id || !m?.body) return;
    const k = m.from || m.to;
    let a = observed.get(k) || [];
    a.push({ id: m.id?._serialized || m.id?.$1 || String(m.id), body: m.body, timestamp: Date.now() });
    observed.set(k, a.filter(x => Date.now() - x.timestamp < TTL).slice(-MAX));
  } catch {}
}

function capture(m) {
  try {
    normalizeId(m?.id);
    const id = m?.id?._serialized || m?.id?.$1;
    if (!id) return;
    for (const [k, a] of observed) {
      const i = a.findIndex(x => x.id === id);
      if (i < 0) continue;
      const [x] = a.splice(i, 1);
      if (a.length) observed.set(k, a);
      else observed.delete(k);
      let d = deleted.get(k) || [];
      d.push({ ...x, deletedAt: Date.now() });
      deleted.set(k, d.filter(y => Date.now() - y.deletedAt < TTL).slice(-MAX));
      break;
    }
  } catch {}
}

client.on('message', remember);
client.on('message_create', remember);
client.on('message_revoke_everyone', capture);

client.on('message_create', async msg => {
  try {
    normalizeId(msg.id);
    if (!msg.fromMe || !msg.body || !msg.body.startsWith(config.prefix)) return;
    const { command, args, rest } = parseArgs(msg.body);
    const c = commands.get(command);
    if (!c) return;

    let chat = null, contact = null;
    try { chat = await msg.getChat(); } catch {}
    try { contact = await msg.getContact(); } catch {}

    await c.run({ client, msg, chat, contact, args, rest, commands, startedAt, config });
  } catch (e) {
    console.error('[COMMAND ERROR]', e?.stack || e);
    try { await msg.reply(`Error: ${e?.message || e}`); } catch {}
  }
});

client.initialize();
