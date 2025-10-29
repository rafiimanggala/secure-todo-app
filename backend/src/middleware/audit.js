const db = require('../config/database');

// Audit log middleware
const auditLog = (defaultAction, defaultTable) => {
  return async (req, res, next) => {
    // Store original methods
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    // Override res.json to capture response
    res.json = function(data) {
      // Log the action after response is sent
      setTimeout(async () => {
        try {
          if (!req.user) return; // log only authenticated actions

          // Map method to action
          const methodToAction = {
            POST: 'CREATE',
            GET: 'READ',
            PUT: 'UPDATE',
            PATCH: 'UPDATE',
            DELETE: 'DELETE'
          };
          const action = methodToAction[req.method] || defaultAction;

          // Derive table from baseUrl if possible
          const knownTables = ['patients', 'users', 'records'];
          const base = (req.baseUrl || '').split('/').filter(Boolean).pop();
          const tableName = knownTables.includes(base) ? base : defaultTable;
          if (!['CREATE','READ','UPDATE','DELETE'].includes(action)) return;
          if (!knownTables.includes(tableName)) return;

          const pool = db.getPoolByRole(req.user.role);
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

