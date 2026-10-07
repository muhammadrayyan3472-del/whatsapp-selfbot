const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const config = require('./core/config');
const { parseArgs } = require('./core/context');
const { loadCommands } = require('./core/loader');
const { normalizeId } = require('./core/helpers');

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
  browserName: 'Chrome',
  ...(pairing ? { pairWithPhoneNumber: { phoneNumber: phone, showNotification: true, intervalMs: 180000 } } : {})
});

const commands = loadCommands(path.join(__dirname, 'commands'));
const startedAt = Date.now();
console.log(`[BOOT] ${commands.__canonicalCount} canonical commands / ${commands.size} keys loaded.`);

client.on('code', code => {
  console.log(`\n=============================\n=== WHATSAPP PAIRING CODE ===\n          ${code}\n=============================\n`);
});

client.on('qr', qr => {
  console.log('[INFO] QR code received; pairing mode:', pairing);
  if (!pairing) {
    try {
      require('qrcode-terminal').generate(qr, { small: true });
    } catch {}
  }
});

client.on('authenticated', () => console.log('[AUTH] Successfully authenticated!'));
client.on('ready', () => console.log(`[READY] WhatsApp client is ready! ${commands.__canonicalCount} commands active.`));
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
