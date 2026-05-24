require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

// Initialize database connection
connectDB();

// Only listen if not running in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
