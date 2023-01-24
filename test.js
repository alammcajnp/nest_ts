// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

function secretKeys() {
  const key1 = crypto.randomBytes(32).toString('hex');
  const key2 = crypto.randomBytes(32).toString('hex');
  console.table({ key1, key2 });
}

secretKeys();
