const express = require('express');
const router = express.Router();
const { 
  getWallet, 
  getWalletSummary, 
  deposit, 
  withdraw, 
  transfer 
} = require('../controllers/walletController');
const { protect } = require('../middlewares/authMiddleware');
const { transactionLimiter } = require('../middlewares/rateLimitMiddleware');

// All wallet routes are protected
router.use(protect);

router.get('/', getWallet);
router.get('/summary', getWalletSummary);
router.post('/deposit', transactionLimiter, deposit);
router.post('/withdraw', transactionLimiter, withdraw);
router.post('/transfer', transactionLimiter, transfer);

module.exports = router;
