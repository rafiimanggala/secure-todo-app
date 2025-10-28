const db = require('../config/database');
const { hashPassword } = require('../middleware/auth');

exports.getAllUsers = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    const result = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const pool = db.getPoolByRole(req.user.role);

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (req.body.username) { fields.push(`username = $${paramCount++}`); values.push(req.body.username); }
    if (req.body.email) { fields.push(`email = $${paramCount++}`); values.push(req.body.email); }
    if (req.body.role) { fields.push(`role = $${paramCount++}`); values.push(req.body.role); }

    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, username, email, role, created_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

