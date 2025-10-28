const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/patient/:id', authenticate, medicalRecordController.getRecordsByPatient);
router.post('/patient/:id', authenticate, authorize('admin', 'dokter'), medicalRecordController.createRecord);
router.put('/:id', authenticate, authorize('admin', 'dokter', 'perawat'), medicalRecordController.updateRecord);

module.exports = router;

