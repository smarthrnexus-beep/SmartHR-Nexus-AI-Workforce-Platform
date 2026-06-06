const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../utils/errorUtils');

router.get('/', protect, asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
}));
router.post('/', protect, asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: req.body, message: 'Leave request submitted' });
}));
router.patch('/:id/approve', protect, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Leave approved' });
}));
router.patch('/:id/reject', protect, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Leave rejected' });
}));
module.exports = router;
