const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { generateTransactionId } = require('../utils/transactionHelper');
const { evaluateSuspiciousTransaction } = require('../utils/suspiciousRules');
const { createNotification } = require('../utils/notificationHelper');
const mongoose = require('mongoose');

// @desc    Get user's own wallet
// @route   GET /api/wallet
// @access  Private
const getWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      res.status(404);
      throw new Error('Wallet not found');
    }

    res.status(200).json({
      status: 'success',
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's wallet summary
// @route   GET /api/wallet/summary
// @access  Private
const getWalletSummary = async (req, res, next) => {
    try {
      const wallet = await Wallet.findOne({ userId: req.user._id });
      if (!wallet) {
        res.status(404);
        throw new Error('Wallet not found');
      }
      res.status(200).json({
        status: 'success',
        data: {
            balance: wallet.balance,
            currency: wallet.currency,
            totalDeposits: wallet.totalDeposits,
            totalWithdrawals: wallet.totalWithdrawals,
            totalTransfersIn: wallet.totalTransfersIn,
            totalTransfersOut: wallet.totalTransfersOut
        },
      });
    } catch (error) {
      next(error);
    }
  };

// @desc    Deposit demo funds
// @route   POST /api/wallet/deposit
// @access  Private
const deposit = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400);
      throw new Error('Deposit amount must be greater than zero');
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      res.status(404);
      throw new Error('Wallet not found');
    }

    // Evaluate Suspicious Activity
    const { isSuspicious, reasons } = await evaluateSuspiciousTransaction(req.user._id, parsedAmount, 'deposit', 'successful');

    // Update Wallet
    wallet.balance += parsedAmount;
    wallet.totalDeposits += parsedAmount;
    await wallet.save();

    // Create Transaction
    const transaction = await Transaction.create({
      transactionId: generateTransactionId(),
      receiverId: req.user._id,
      amount: parsedAmount,
      type: 'deposit',
      status: isSuspicious ? 'flagged' : 'successful',
      description: description || 'Wallet Deposit',
      suspiciousFlag: isSuspicious,
      suspiciousReasons: reasons,
    });

    await createNotification(req.user._id, 'Deposit Successful', `Your deposit of Rs. ${parsedAmount.toLocaleString()} was successful.`, 'transaction', transaction._id);
    if (isSuspicious) {
      await createNotification(req.user._id, 'Security Flag', 'Your recent deposit was flagged for security review.', 'security', transaction._id);
    }

    res.status(200).json({
      status: 'success',
      message: 'Deposit successful',
      data: {
        transaction,
        newBalance: wallet.balance,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw demo funds
// @route   POST /api/wallet/withdraw
// @access  Private
const withdraw = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400);
      throw new Error('Withdrawal amount must be greater than zero');
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      res.status(404);
      throw new Error('Wallet not found');
    }

    if (wallet.balance < parsedAmount) {
      // Record failed transaction attempt
      const { isSuspicious, reasons } = await evaluateSuspiciousTransaction(req.user._id, parsedAmount, 'withdrawal', 'failed');
      
      await Transaction.create({
        transactionId: generateTransactionId(),
        senderId: req.user._id,
        amount: parsedAmount,
        type: 'withdrawal',
        status: isSuspicious ? 'flagged' : 'failed',
        description: 'Failed Withdrawal - Insufficient balance',
        suspiciousFlag: isSuspicious,
        suspiciousReasons: reasons,
      });
      
      await createNotification(req.user._id, 'Withdrawal Failed', 'Withdrawal failed due to insufficient balance.', 'transaction');
      
      res.status(400);
      throw new Error('Insufficient wallet balance');
    }

    const { isSuspicious, reasons } = await evaluateSuspiciousTransaction(req.user._id, parsedAmount, 'withdrawal', 'successful');

    // Proceed with withdrawal
    wallet.balance -= parsedAmount;
    wallet.totalWithdrawals += parsedAmount;
    await wallet.save();

    const transaction = await Transaction.create({
      transactionId: generateTransactionId(),
      senderId: req.user._id,
      amount: parsedAmount,
      type: 'withdrawal',
      status: isSuspicious ? 'flagged' : 'successful',
      description: description || 'Wallet Withdrawal',
      suspiciousFlag: isSuspicious,
      suspiciousReasons: reasons,
    });

    await createNotification(req.user._id, 'Withdrawal Successful', `Your withdrawal of Rs. ${parsedAmount.toLocaleString()} was successful.`, 'transaction', transaction._id);
    if (isSuspicious) {
      await createNotification(req.user._id, 'Security Flag', 'Your recent withdrawal was flagged for security review.', 'security', transaction._id);
    }

    if (wallet.balance < 500) {
      await createNotification(req.user._id, 'Low Balance Alert', `Your wallet balance is low (Rs. ${wallet.balance.toLocaleString()}). Please deposit funds to continue.`, 'security');
    }

    res.status(200).json({
      status: 'success',
      message: 'Withdrawal successful',
      data: {
        transaction,
        newBalance: wallet.balance,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer demo funds to another registered user
// @route   POST /api/wallet/transfer
// @access  Private
const transfer = async (req, res, next) => {
  try {
    const { receiverEmail, amount, description } = req.body;
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400);
      throw new Error('Transfer amount must be greater than zero');
    }

    if (req.user.email === receiverEmail) {
      res.status(400);
      throw new Error('Cannot transfer funds to yourself');
    }

    // Find receiver
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      res.status(404);
      throw new Error('Receiver not found');
    }
    if (receiver.status === 'blocked') {
      res.status(403);
      throw new Error('Cannot transfer to a blocked user');
    }

    // Find wallets
    const senderWallet = await Wallet.findOne({ userId: req.user._id });
    const receiverWallet = await Wallet.findOne({ userId: receiver._id });

    if (!senderWallet || !receiverWallet) {
      res.status(404);
      throw new Error('Wallet not found');
    }

    if (senderWallet.balance < parsedAmount) {
      const { isSuspicious, reasons } = await evaluateSuspiciousTransaction(req.user._id, parsedAmount, 'transfer', 'failed');
      
      // Record failed transaction attempt
      await Transaction.create({
        transactionId: generateTransactionId(),
        senderId: req.user._id,
        receiverId: receiver._id,
        amount: parsedAmount,
        type: 'transfer',
        status: isSuspicious ? 'flagged' : 'failed',
        description: 'Failed Transfer - Insufficient balance',
        suspiciousFlag: isSuspicious,
        suspiciousReasons: reasons,
      });

      await createNotification(req.user._id, 'Transfer Failed', 'Transfer failed due to insufficient balance.', 'transaction');

      res.status(400);
      throw new Error('Insufficient wallet balance for transfer');
    }

    const { isSuspicious, reasons } = await evaluateSuspiciousTransaction(req.user._id, parsedAmount, 'transfer', 'successful');

    // Execute transfer
    senderWallet.balance -= parsedAmount;
    senderWallet.totalTransfersOut += parsedAmount;
    await senderWallet.save();

    receiverWallet.balance += parsedAmount;
    receiverWallet.totalTransfersIn += parsedAmount;
    await receiverWallet.save();

    const transaction = await Transaction.create({
      transactionId: generateTransactionId(),
      senderId: req.user._id,
      receiverId: receiver._id,
      amount: parsedAmount,
      type: 'transfer',
      status: isSuspicious ? 'flagged' : 'successful',
      description: description || 'Wallet Transfer',
      suspiciousFlag: isSuspicious,
      suspiciousReasons: reasons,
    });

    await createNotification(req.user._id, 'Transfer Sent', `You sent Rs. ${parsedAmount.toLocaleString()} to ${receiver.email}.`, 'transaction', transaction._id);
    await createNotification(receiver._id, 'Transfer Received', `You received Rs. ${parsedAmount.toLocaleString()} from ${req.user.email}.`, 'transaction', transaction._id);
    if (isSuspicious) {
      await createNotification(req.user._id, 'Security Flag', 'Your recent transfer was flagged for security review.', 'security', transaction._id);
    }

    if (senderWallet.balance < 500) {
      await createNotification(req.user._id, 'Low Balance Alert', `Your wallet balance is low (Rs. ${senderWallet.balance.toLocaleString()}). Please deposit funds to continue.`, 'security');
    }

    res.status(200).json({
      status: 'success',
      message: 'Transfer successful',
      data: {
        transaction,
        newBalance: senderWallet.balance,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWallet,
  getWalletSummary,
  deposit,
  withdraw,
  transfer,
};
