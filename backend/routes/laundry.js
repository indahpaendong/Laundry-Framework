const express = require('express');
const router = express.Router();
const laundryController = require('../controllers/laundryController');
const { verifyToken } = require('../middleware/auth');

// Semua route laundry butuh login (kecuali tracking)
router.use(verifyToken);

router.get('/', laundryController.getAll);
router.get('/:id', laundryController.getById);
router.post('/', laundryController.create);
router.put('/:id', laundryController.update);
router.put('/:id/status', laundryController.updateStatus);
router.delete('/:id', laundryController.delete);

module.exports = router;