const path = require('path');
const { loadCommands } = require('../src/core/loader');

const commands = loadCommands(path.join(__dirname, '../src/commands'));
console.log(`Loaded ${commands.__canonicalCount} canonical commands / ${commands.size} total keys.`);

const results = [];

async function testCmd(name, input, expectedCheck) {
  const c = commands.get(name);
  if (!c) throw new Error(`Command not found: ${name}`);

  let replyText = '';
  const mockMsg = {
    from: '12345@c.us',
    to: '12345@c.us',
    fromMe: true,
    body: input,
    type: 'chat',
    hasQuotedMsg: false,
    reply: async t => {
      replyText = String(t);
      return { edit: async () => {} };
    }
  };

  const args = input.slice(1).trim().split(/\s+/).slice(1);
  const rest = args.join(' ');

  await c.run({
    client: {
      getState: async () => 'CONNECTED',
      info: { wid: { _serialized: '12345@c.us' }, platform: 'test' },
      getChats: async () => []
    },
    msg: mockMsg,
    chat: { id: { _serialized: '12345@c.us' }, name: 'Test Chat', isGroup: false },
    contact: { id: { _serialized: '12345@c.us' }, name: 'Rayyan' },
    args,
    rest,
    commands,
    startedAt: Date.now(),
    config: { prefix: '.', ownerOnly: true, timezone: 'Asia/Karachi' }
  });

  const ok = expectedCheck(replyText);
  if (!ok) {
    throw new Error(`FAIL on ${name}: received "${replyText}"`);
  }
  results.push({ name, reply: replyText });
}

(async () => {
  // Test accurate mathematical evaluation
  await testCmd('calc', '.calc 12+4*2', r => r.includes('20'));
  await testCmd('pct', '.pct 20 500', r => r.includes('100'));

  // Test text transformations with ZAYDX UI format
  await testCmd('caps', '.caps hello world', r => r.includes('HELLO WORLD') && r.includes('CAPS'));
  await testCmd('lower', '.lower HELLO WORLD', r => r.includes('hello world') && r.includes('LOWER'));
  await testCmd('reverse', '.reverse abc', r => r.includes('cba'));
  await testCmd('mock', '.mock hello world', r => r.includes('hElLo wOrLd'));
  await testCmd('base64text', '.base64text hello', r => r.includes('aGVsbG8='));

  // Test unit conversions
  await testCmd('c2f', '.c2f 0', r => r.includes('32.00 °F'));
  await testCmd('km2mi', '.km2mi 10', r => r.includes('6.21 miles'));

  // Test utilities
  await testCmd('note', '.note test note', r => r.includes('Saved note'));
  await testCmd('todo', '.todo test task', r => r.includes('Added Todo'));
  await testCmd('ping', '.ping', r => r.includes('Pong'));
  await testCmd('help', '.help core', r => r.includes('CORE'));

  console.log(`SMOKE_OK: Verified ${results.length} core test assertions successfully!`);
})().catch(e => {
  console.error('[SMOKE TEST FAILED]', e);
  process.exit(1);
});
