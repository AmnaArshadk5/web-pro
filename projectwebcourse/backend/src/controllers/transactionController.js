const Transaction = require('../models/Transaction');

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const { type, status, startDate, endDate, category, search } = req.query;
    
    // Base query: user is either sender or receiver
    const query = {
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    };

    if (type) query.type = type;
    if (status) query.status = status;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$and = [
        {
          $or: [
            { description: { $regex: search, $options: 'i' } },
            { transactionId: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    const transactions = await Transaction.find(query)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    // Check ownership or admin
    if (
      req.user.role !== 'admin' &&
      transaction.senderId?._id.toString() !== req.user._id.toString() &&
      transaction.receiverId?._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to view this transaction');
    }

    res.status(200).json({
      status: 'success',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly transaction summary
// @route   GET /api/transactions/summary/monthly
// @access  Private
const getTransactionSummaryMonthly = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await Transaction.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
      status: 'successful',
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const summary = {
      totalIn: 0,
      totalOut: 0,
      count: transactions.length,
    };

    transactions.forEach(t => {
      if (t.receiverId?.toString() === req.user._id.toString()) {
        summary.totalIn += t.amount;
      } else if (t.senderId?.toString() === req.user._id.toString()) {
        summary.totalOut += t.amount;
      }
    });

    res.status(200).json({ status: 'success', data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionSummaryMonthly,
};
