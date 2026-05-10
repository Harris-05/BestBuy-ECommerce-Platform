const dotenv = require('dotenv');
const app = require('../src/app');
const { connectDB } = require('../src/db');

dotenv.config();

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error('Serverless bootstrap error:', err);
    return res.status(500).json({ success: false, message: 'Server initialization failed' });
  }
};
