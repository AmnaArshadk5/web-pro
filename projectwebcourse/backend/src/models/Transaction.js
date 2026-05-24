const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer', 'refund', 'fee', 'billPayment', 'payment'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'flagged'],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.Mixed, // String or ObjectId
    },
    description: {
      type: String,
    },
    suspiciousFlag: {
      type: Boolean,
      default: false,
    },
    suspiciousReasons: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
