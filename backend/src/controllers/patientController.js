const db = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');
const { body, validationResult } = require('express-validator');

exports.getAllPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    const pool = db.getPoolByRole(req.user.role);

    let query = 'SELECT id, nama, nik_encrypted, tanggal_lahir, jenis_kelamin, alamat, telepon_encrypted, golongan_darah, status, created_at FROM patients';
    let countQuery = 'SELECT COUNT(*) FROM patients';
    const params = [];
    let paramCount = 0;

    if (search) {
      query += ` WHERE nama ILIKE $${++paramCount}`;
      countQuery += ` WHERE nama ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(limit, offset);

    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, paramCount - 2))
    ]);

    const patients = result.rows;
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: patients,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const patient = result.rows[0];
    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

exports.createPatient = [
  body('nama').notEmpty(),
  body('nik').notEmpty(),
  body('tanggal_lahir').isISO8601(),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const pool = db.getPoolByRole(req.user.role);
      const result = await pool.query(
        `INSERT INTO patients (nama, nik_encrypted, tanggal_lahir, jenis_kelamin, alamat, 
         telepon_encrypted, golongan_darah, riwayat_penyakit, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          req.body.nama, encrypt(req.body.nik || ''), req.body.tanggal_lahir,
          req.body.jenis_kelamin || 'Laki-laki', req.body.alamat || '',
          encrypt(req.body.telepon || ''), req.body.golongan_darah,
          req.body.riwayat_penyakit, req.user.id
        ]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
];

exports.updatePatient = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (req.body.nama) { fields.push(`nama = $${paramCount++}`); values.push(req.body.nama); }
    if (req.body.tanggal_lahir) { fields.push(`tanggal_lahir = $${paramCount++}`); values.push(req.body.tanggal_lahir); }
    if (req.body.alamat) { fields.push(`alamat = $${paramCount++}`); values.push(req.body.alamat); }

    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE patients SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.deletePatient = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, message: 'Patient deleted' });
  } catch (error) {
    next(error);
  }
};

