const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { comparePassword } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Login
exports.login = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      const pool = db.adminPool;
      
      const result = await pool.query(
        'SELECT id, username, email, password_hash, role FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isValid = await comparePassword(password, user.password_hash);

      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
];

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const pool = db.adminPool;
    const result = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Logout (client-side token removal, this is just for logging)
exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

