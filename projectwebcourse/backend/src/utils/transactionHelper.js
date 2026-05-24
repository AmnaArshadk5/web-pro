const crypto = require('crypto');

const generateTransactionId = () => {
  const dateStr = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 8); // YYYYMMDD
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 random characters
  return `TXN-${dateStr}-${randomStr}`;
};

module.exports = { generateTransactionId };
