const db = require('../config/database');

// Audit log middleware
const auditLog = (action, tableName) => {
  return async (req, res, next) => {
    // Store original methods
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    // Override res.json to capture response
    res.json = function(data) {
      // Log the action after response is sent
      setTimeout(async () => {
        try {
          const pool = db.getPoolByRole(req.user?.role || 'admin');
          const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          
          await pool.query(
            `INSERT INTO audit_logs (user_id, action, table_name, record_id, ip_address)
             VALUES ($1, $2, $3, $4, $5)`,
            [req.user?.id, action, tableName, req.params?.id || null, ipAddress]
          );
        } catch (error) {
          console.error('Audit log error:', error);
        }
      }, 0);

      originalJson(data);
    };

    res.send = function(data) {
      originalSend(data);
    };

    next();
  };
};

module.exports = { auditLog };

