const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanAmount: {
    type: Number,
    required: [true, 'Please provide loan amount']
  },
  loanTerm: {
    type: Number,
    required: [true, 'Please provide loan term (in months)']
  },
  monthlyIncome: {
    type: Number,
    required: [true, 'Please provide monthly income']
  },
  creditScore: {
    type: Number,
    required: [true, 'Please provide credit score']
  },
  employmentType: {
    type: String,
    enum: ['Employed', 'Self-Employed', 'Unemployed'],
    default: 'Employed'
  },
  status: {
    type: String,
    enum: ['Approved', 'Rejected', 'Under Review', 'Pending'],
    default: 'Pending'
  },
  mlScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
loanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Loan', loanSchema);
