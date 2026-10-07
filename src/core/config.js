try {
  require('dotenv').config();
} catch {}

module.exports = {
  prefix: process.env.PREFIX || '.',
  ownerOnly: (process.env.OWNER_ONLY || 'true').toLowerCase() === 'true',
  authDir: process.env.AUTH_DIR || '.wwebjs_auth',
  timezone: process.env.TIMEZONE || 'Asia/Karachi'
};
