const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, patientController.getAllPatients);
router.get('/:id', authenticate, patientController.getPatientById);
router.post('/', authenticate, authorize('admin', 'dokter'), patientController.createPatient);
router.put('/:id', authenticate, authorize('admin', 'dokter'), patientController.updatePatient);
router.delete('/:id', authenticate, authorize('admin'), patientController.deletePatient);

module.exports = router;

