const config=require('./config');
function parseArgs(body){const raw=body.slice(config.prefix.length).trim();const parts=raw?raw.split(/\s+/):[];return{raw,command:(parts.shift()||'').toLowerCase(),args:parts,rest:parts.join(' ')}}
module.exports={parseArgs};
