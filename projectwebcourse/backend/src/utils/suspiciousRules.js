const Transaction = require('../models/Transaction');
const User = require('../models/User');

const evaluateSuspiciousTransaction = async (userId, amount, type, status) => {
  let isSuspicious = false;
  const reasons = [];

  // Rule 1: High value transfer (e.g., > 100,000)
  if (type === 'transfer' && amount > 100000) {
    isSuspicious = true;
    reasons.push('Transfer amount exceeds 100,000 PKR threshold');
  }

  // Rule 2: High value deposit (e.g., > 200,000)
  if (type === 'deposit' && amount > 200000) {
    isSuspicious = true;
    reasons.push('Deposit amount exceeds 200,000 PKR threshold');
  }

  const now = new Date();

  // Rule 3: Rapid transfers (> 5 transfers in 10 minutes)
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  const recentTransfers = await Transaction.countDocuments({
    senderId: userId,
    type: 'transfer',
    createdAt: { $gte: tenMinutesAgo },
  });
  if (type === 'transfer' && recentTransfers >= 5) {
    isSuspicious = true;
    reasons.push('More than 5 transfers attempted within 10 minutes');
  }

  // Rule 4: Frequent failed withdrawals (> 3 failed in 24 hours)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (type === 'withdrawal' && status === 'failed') {
    const recentFailedWithdrawals = await Transaction.countDocuments({
      senderId: userId,
      type: 'withdrawal',
      status: 'failed',
      createdAt: { $gte: oneDayAgo },
    });
    // This current one makes it > 3 if count was already >= 3
    if (recentFailedWithdrawals >= 3) {
      isSuspicious = true;
      reasons.push('More than 3 failed withdrawal attempts in 24 hours');
    }
  }

  // Rule 5: New user high value transaction
  const user = await User.findById(userId);
  if (user) {
    const accountAgeMs = now.getTime() - new Date(user.createdAt).getTime();
    const accountAgeHours = accountAgeMs / (1000 * 60 * 60);
    
    if (accountAgeHours < 24 && amount > 50000) {
      isSuspicious = true;
      reasons.push('High value transaction (over 50,000) by newly registered user (under 24h)');
    }
  }

  return { isSuspicious, reasons };
};

module.exports = { evaluateSuspiciousTransaction };
