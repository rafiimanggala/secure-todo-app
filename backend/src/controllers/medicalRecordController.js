const db = require('../config/database');

exports.getRecordsByPatient = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    const result = await pool.query(
      `SELECT mr.*, u.username, u.email 
       FROM medical_records mr 
       JOIN users u ON mr.created_by = u.id 
       WHERE mr.patient_id = $1 ORDER BY mr.tanggal_kunjungan DESC`,
      [req.params.id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.createRecord = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    const result = await pool.query(
      `INSERT INTO medical_records (patient_id, diagnosis, resep, status, tanggal_kunjungan, catatan, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        req.params.id,
        req.body.diagnosis,
        req.body.resep,
        req.body.status || 'Aktif',
        req.body.tanggal_kunjungan || new Date().toISOString().split('T')[0],
        req.body.catatan,
        req.user.id
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.updateRecord = async (req, res, next) => {
  try {
    const pool = db.getPoolByRole(req.user.role);
    
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (req.body.diagnosis) { fields.push(`diagnosis = $${paramCount++}`); values.push(req.body.diagnosis); }
    if (req.body.resep) { fields.push(`resep = $${paramCount++}`); values.push(req.body.resep); }
    if (req.body.status) { fields.push(`status = $${paramCount++}`); values.push(req.body.status); }
    if (req.body.catatan) { fields.push(`catatan = $${paramCount++}`); values.push(req.body.catatan); }

    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE medical_records SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

