const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Loan = require('./models/Loan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ============================================
// AUTHENTICATION MIDDLEWARE & UTILITIES
// ============================================

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'credit-wise-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'credit-wise-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName, phone, employment } = req.body;

    if (!email || !password || !fullName || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = new User({
      email,
      password,
      fullName,
      phone,
      employment: employment || 'Employed'
    });

    await user.save();

    const token = generateToken(user._id);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get Current User
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', verifyToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ============================================
// LOAN ROUTES (Protected)
// ============================================

// Apply for Loan
app.post('/api/loans/apply', verifyToken, async (req, res) => {
  try {
    const { loanAmount, loanTerm, monthlyIncome, creditScore, employmentType } = req.body;

    if (!loanAmount || !loanTerm || !monthlyIncome || creditScore === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let mlPrediction = 'Pending';
    let confidenceScore = 0;

    try {
      const mlResponse = await fetch(process.env.ML_API_URL || 'http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loan_amount: loanAmount,
          loan_term: loanTerm,
          monthly_income: monthlyIncome,
          credit_score: creditScore,
          employment_type: employmentType || 'Employed'
        })
      });

      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        mlPrediction = mlData.prediction || 'Pending';
        confidenceScore = mlData.confidence || 0;
      }
    } catch (mlError) {
      console.log('ML API unavailable, using heuristic scoring');
      const debtToIncomeRatio = (loanAmount / 12) / monthlyIncome;
      if (creditScore >= 700 && debtToIncomeRatio <= 0.4) {
        mlPrediction = 'Approved';
        confidenceScore = 0.85;
      } else if (creditScore >= 650 && debtToIncomeRatio <= 0.5) {
        mlPrediction = 'Under Review';
        confidenceScore = 0.65;
      } else {
        mlPrediction = 'Rejected';
        confidenceScore = 0.75;
      }
    }

    const loan = new Loan({
      userId: req.userId,
      loanAmount,
      loanTerm,
      monthlyIncome,
      creditScore,
      employmentType: employmentType || 'Employed',
      status: mlPrediction === 'Approved' ? 'Approved' : mlPrediction === 'Rejected' ? 'Rejected' : 'Under Review',
      mlScore: confidenceScore,
      appliedAt: new Date()
    });

    await loan.save();

    res.status(201).json({
      message: 'Loan application submitted',
      loan,
      prediction: mlPrediction,
      confidenceScore
    });
  } catch (error) {
    console.error('Loan application error:', error);
    res.status(500).json({ message: 'Loan application failed', error: error.message });
  }
});

// Get User's Loan History
app.get('/api/loans/history', verifyToken, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.userId }).sort({ appliedAt: -1 });
    res.json({
      totalApplications: loans.length,
      loans
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loan history', error: error.message });
  }
});

// Get Single Loan
app.get('/api/loans/:id', verifyToken, async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loan', error: error.message });
  }
});

// Update Loan Status
app.patch('/api/loans/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const loan = await Loan.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json({
      message: 'Loan updated',
      loan
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update loan', error: error.message });
  }
});

// Get Dashboard Stats
app.get('/api/stats/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const loans = await Loan.find({ userId: req.userId });

    const approved = loans.filter(l => l.status === 'Approved').length;
    const rejected = loans.filter(l => l.status === 'Rejected').length;
    const underReview = loans.filter(l => l.status === 'Under Review').length;
    const totalApproved = loans
      .filter(l => l.status === 'Approved')
      .reduce((sum, l) => sum + l.loanAmount, 0);

    res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        employment: user.employment,
        memberSince: user.createdAt
      },
      stats: {
        totalApplications: loans.length,
        approved,
        rejected,
        underReview,
        totalApprovedAmount: totalApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
