// ─── payroll.routes.js ───────────────────────────────────────────────────────
const express = require('express');
const payrollRouter = express.Router();
const { protect, adminOnly, hrAndAbove } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../utils/errorUtils');
const Payroll = require('../models/Payroll.model');

payrollRouter.get('/', protect, hrAndAbove, asyncHandler(async (req, res) => {
  const { month, year, employeeId, status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (month) query['payPeriod.month'] = parseInt(month);
  if (year) query['payPeriod.year'] = parseInt(year);
  if (status) query.status = status;
  if (req.user.role === 'employee') query.employee = req.user._id;
  else if (employeeId) query.employee = employeeId;

  const records = await Payroll.find(query)
    .populate('employee', 'firstName lastName employeeId department')
    .sort({ 'payPeriod.year': -1, 'payPeriod.month': -1 })
    .skip((page - 1) * limit).limit(parseInt(limit));

  const total = await Payroll.countDocuments(query);
  res.json({ success: true, data: records, total });
}));

payrollRouter.post('/process', protect, adminOnly, asyncHandler(async (req, res) => {
  const { employeeIds, month, year } = req.body;
  // Simplified: create payroll records for given employees
  const created = [];
  for (const empId of employeeIds) {
    const record = await Payroll.findOneAndUpdate(
      { employee: empId, 'payPeriod.month': month, 'payPeriod.year': year },
      { $setOnInsert: { employee: empId, payPeriod: { month, year }, status: 'draft', processedBy: req.user._id, earnings: { basicSalary: req.body.basicSalary || 0 } } },
      { upsert: true, new: true }
    );
    created.push(record);
  }
  res.status(201).json({ success: true, data: created, message: `Payroll processed for ${created.length} employees` });
}));

payrollRouter.patch('/:id/approve', protect, adminOnly, asyncHandler(async (req, res) => {
  const record = await Payroll.findByIdAndUpdate(req.params.id, { status: 'approved', approvedBy: req.user._id, approvedAt: new Date() }, { new: true });
  res.json({ success: true, data: record });
}));

module.exports = payrollRouter;
