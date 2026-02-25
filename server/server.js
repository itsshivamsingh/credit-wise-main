const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const Loan = require('./models/Loan');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Submit loan application
app.post('/api/loans/apply', async (req, res) => {
  try {
    const {
      applicant_id,
      applicant_income,
      coapplicant_income,
      employment_status,
      age,
      marital_status,
      dependents,
      credit_score,
      existing_loans,
      loan_amount,
      loan_term,
      home_ownership,
      years_employed,
      email,
      phone
    } = req.body;

    // Validate required fields
    if (!applicant_id || !applicant_income || !employment_status || !age || !marital_status || 
        !credit_score || !loan_amount || !loan_term || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if applicant already exists
    const existingLoan = await Loan.findOne({ applicant_id });
    if (existingLoan) {
      return res.status(400).json({ error: 'Applicant ID already exists' });
    }

    // Create new loan application
    const loanApplication = new Loan({
      applicant_id,
      applicant_income,
      coapplicant_income,
      employment_status,
      age,
      marital_status,
      dependents,
      credit_score,
      existing_loans,
      loan_amount,
      loan_term,
      home_ownership,
      years_employed,
      email,
      phone,
      status: 'Pending'
    });

    // Call ML API for prediction
    try {
      const mlResponse = await axios.post(process.env.PYTHON_API_URL + '/predict', {
        applicant_income,
        coapplicant_income,
        employment_status,
        age,
        marital_status,
        dependents,
        credit_score,
        existing_loans,
        loan_amount,
        loan_term,
        home_ownership,
        years_employed
      });

      loanApplication.prediction = mlResponse.data.prediction;
      loanApplication.confidence_score = mlResponse.data.confidence;
      loanApplication.status = 'Processed';
    } catch (err) {
      console.log('⚠️ ML API not available, will process manually:', err.message);
      loanApplication.status = 'Pending';
    }

    await loanApplication.save();
    res.status(201).json({
      message: 'Loan application submitted successfully',
      application: loanApplication
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get loan application by ID
app.get('/api/loans/:applicantId', async (req, res) => {
  try {
    const loan = await Loan.findOne({ applicant_id: req.params.applicantId });
    if (!loan) {
      return res.status(404).json({ error: 'Loan application not found' });
    }
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all loan applications (admin)
app.get('/api/loans', async (req, res) => {
  try {
    const loans = await Loan.find().sort({ created_at: -1 });
    res.json({
      total: loans.length,
      applications: loans
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get loan statistics
app.get('/api/loans/stats/overview', async (req, res) => {
  try {
    const total = await Loan.countDocuments();
    const approved = await Loan.countDocuments({ status: 'Approved' });
    const rejected = await Loan.countDocuments({ status: 'Rejected' });
    const pending = await Loan.countDocuments({ status: 'Pending' });

    res.json({
      total,
      approved,
      rejected,
      pending,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update loan status
app.put('/api/loans/:applicantId', async (req, res) => {
  try {
    const { status, prediction } = req.body;
    const loan = await Loan.findOneAndUpdate(
      { applicant_id: req.params.applicantId },
      { status, prediction, updated_at: Date.now() },
      { new: true }
    );
    if (!loan) {
      return res.status(404).json({ error: 'Loan application not found' });
    }
    res.json({ message: 'Loan status updated', loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
