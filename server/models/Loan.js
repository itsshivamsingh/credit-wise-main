const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  applicant_id: {
    type: String,
    required: true,
    unique: true
  },
  applicant_income: {
    type: Number,
    required: true
  },
  coapplicant_income: {
    type: Number,
    default: 0
  },
  employment_status: {
    type: String,
    enum: ['Salaried', 'Self-Employed'],
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  marital_status: {
    type: String,
    enum: ['Single', 'Married', 'Divorced'],
    required: true
  },
  dependents: {
    type: Number,
    default: 0
  },
  credit_score: {
    type: Number,
    required: true
  },
  existing_loans: {
    type: Number,
    default: 0
  },
  loan_amount: {
    type: Number,
    required: true
  },
  loan_term: {
    type: Number,
    required: true
  },
  home_ownership: {
    type: String,
    enum: ['Own', 'Mortgage', 'Rent'],
    default: 'Rent'
  },
  years_employed: {
    type: Number,
    default: 0
  },
  prediction: {
    type: String,
    enum: ['Approved', 'Rejected'],
    default: null
  },
  confidence_score: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', loanSchema);
