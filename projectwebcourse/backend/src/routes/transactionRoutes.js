const express = require('express');
const router = express.Router();
const { getTransactions, getTransactionById, getTransactionSummaryMonthly } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getTransactions);
router.get('/summary/monthly', getTransactionSummaryMonthly);
router.get('/:id', getTransactionById);
router.get('/:id/receipt', getTransactionById); // Reusing the same for receipt data

module.exports = router;
