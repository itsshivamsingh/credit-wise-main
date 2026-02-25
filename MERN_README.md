# CreditWise - Complete MERN Stack Application

A full-stack loan approval system using **MongoDB**, **Express**, **React/Vanilla JS**, and **Node.js** with AI-powered loan decision making.

## 📋 Project Structure

```
creditwise-loan-system/
│
├── client/                    # Frontend (Vanilla HTML/CSS/JS)
│   ├── index.html            # Landing/Home page
│   ├── login.html            # User login
│   ├── register.html         # User registration
│   ├── dashboard.html        # User dashboard
│   ├── apply.html            # Loan application form
│   ├── history.html          # Loan history & tracking
│   ├── style.css             # All styling (responsive)
│   └── script.js             # Frontend logic
│
├── server/                    # Backend (Node.js + Express)
│   ├── server.js             # Main Express server
│   ├── models/
│   │   ├── User.js           # User schema (Mongoose)
│   │   └── Loan.js           # Loan schema (Mongoose)
│   ├── package.json          # Dependencies
│   ├── .env                  # Environment variables
│   └── test-db.js            # Database connection test
│
├── ml_api/                    # Python ML API (Optional)
│   ├── app.py                # Flask application
│   └── model.pkl             # Trained ML model
│
├── DATABASE_SETUP.md         # Complete MongoDB Atlas setup guide
├── MONGO_QUICK_START.md      # Quick 5-minute setup
└── MERN_README.md           # This file
```

---

## 🎯 Features

✅ **User Authentication**
- Secure registration with validation
- Login with JWT tokens
- Password hashing with bcrypt
- User session management

✅ **Loan Management**
- Apply for loans with detailed information
- Real-time AI prediction (Approved/Rejected/Under Review)
- View loan application history
- Track loan status in dashboard

✅ **Dashboard**
- User profile information
- Statistics (approved, rejected, pending loans)
- Total approved amount
- Member since date

✅ **AI Integration**
- Machine learning predictions
- Confidence score for decisions
- Fallback heuristic scoring
- Instant decisions

✅ **Database**
- MongoDB Atlas cloud database
- Mongoose ORM
- Secure data storage
- Automatic collection creation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git (optional)

### Installation

#### 1. Clone/Download the Project
```bash
git clone <your-repo>
cd creditwise-loan-system
```

#### 2. Set Up MongoDB Atlas
Follow the **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** guide to:
- Create a free MongoDB Atlas cluster
- Get your connection string
- Configure environment variables

#### 3. Set Up Backend
```bash
cd server
npm install
```

Create/Update `.env` file:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/creditwise?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
ML_API_URL=http://localhost:5000/predict
PORT=5001
NODE_ENV=development
```

#### 4. Test Database Connection
```bash
node test-db.js
```

Expected output:
```
✅ SUCCESS: Connected to MongoDB!
📊 Database Information:
   Database Name: creditwise
   ...
```

#### 5. Start the Backend Server
```bash
npm start
```

Server runs on: `http://localhost:5001`

#### 6. Serve the Frontend
Open a new terminal:
```bash
cd client

# Option A: Using Python (if installed)
python -m http.server 8000

# Option B: Using Node.js
npx serve

# Option C: Using VS Code Live Server extension
# Just click "Go Live"
```

Frontend runs on: `http://localhost:8000`

---

## 📖 Usage

### 1. Register a New Account
- Go to `http://localhost:8000`
- Click **Create Account**
- Fill in:
  - Email (must be valid)
  - Full Name
  - Phone (10 digits)
  - Employment Type
  - Password
- Click **Register**
- Automatically logs you in

### 2. Access Dashboard
- View your profile info
- See statistics
- Check member since date

### 3. Apply for a Loan
- Click **Apply Loan** in navigation
- Fill in loan details:
  - Loan Amount
  - Loan Term (months)
  - Monthly Income
  - Credit Score
  - Employment Type
- Click **Submit**
- Get instant AI decision!

### 4. View Loan History
- Click **Loan History**
- See all your applications
- Filter by status
- Click "View Details" for more info

### 5. Logout
- Click **Logout** button
- Returns to login page

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,              // Unique
  password: String,           // Hashed
  fullName: String,
  phone: String,             // 10 digits
  employment: String,        // Employed, Self-Employed, Unemployed, Student
  createdAt: Date,           // Auto-generated
  lastLogin: Date,           // Updated on each login
  isActive: Boolean          // Default: true
}
```

### Loans Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Reference to User
  loanAmount: Number,
  loanTerm: Number,         // Months
  monthlyIncome: Number,
  creditScore: Number,       // 300-850
  employmentType: String,
  status: String,           // Approved, Rejected, Under Review, Pending
  mlScore: Number,          // 0-1 (confidence)
  appliedAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

All endpoints require `Authorization: Bearer <token>` header (except auth routes)

### Authentication Routes
```
POST   /api/auth/register      # Create new account
POST   /api/auth/login         # Login user
POST   /api/auth/logout        # Logout user
GET    /api/auth/me            # Get current user (protected)
```

### Loan Routes (Protected)
```
POST   /api/loans/apply        # Submit loan application
GET    /api/loans/history      # Get user's loans
GET    /api/loans/:id          # Get specific loan
PATCH  /api/loans/:id          # Update loan status
GET    /api/stats/dashboard    # Get dashboard stats
```

### Example Request
```javascript
// Apply for loan
fetch('http://localhost:5001/api/loans/apply', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    loanAmount: 500000,
    loanTerm: 60,
    monthlyIncome: 50000,
    creditScore: 750,
    employmentType: 'Employed'
  })
})
```

---

## 🔐 Security Features

✅ **Password Security**
- Bcrypt hashing (salt rounds: 10)
- Never stored in plain text
- Minimum 6 characters

✅ **JWT Authentication**
- Token expiration: 7 days
- Secure key management
- Bearer token in headers

✅ **Database Security**
- MongoDB Atlas encryption
- IP whitelisting
- Unique email validation
- User isolation (can only see own loans)

✅ **API Security**
- CORS enabled
- Input validation
- Error message hiding (no sensitive data leaks)
- Rate limiting ready

---

## 🐛 Troubleshooting

### Server won't start
```
Error: Cannot find module 'mongoose'
→ Run: npm install in server folder
```

### MongoDB Connection Error
```
Error: MongoDB connection failed
→ Check MONGO_URI in .env
→ Verify IP whitelist in MongoDB Atlas
→ Ensure cluster is running
```

### Can't register user
```
Error: Email already exists
→ Use a different email address

Error: Validation failed
→ Check all fields are filled
→ Phone must be 10 digits
→ Email must be valid format
```

### Login not working
```
Error: Invalid email or password
→ Check email and password are correct
→ Make sure you registered first

Error: No token provided
→ Login was successful but JWT creation failed
→ Check JWT_SECRET in .env
```

### ML API not working
```
If ML API not available, heuristic scoring is used:
- Credit Score >= 700 and DTI <= 40% → Approved
- Credit Score >= 650 and DTI <= 50% → Under Review
- Otherwise → Rejected
```

### Loan not saving to database
```
Error: User not found
→ Make sure you're logged in
→ Token in localStorage might be expired

Error: Loan application failed
→ Check all fields are filled
→ Credit score should be 300-850
→ Loan amount must be positive
```

---

## 📊 Testing the Application

### Test Data
```
Email: test@creditwise.com
Password: Test@123
Phone: 9876543210
Employment: Employed

Loan:
- Amount: 500000
- Term: 60 months
- Monthly Income: 50000
- Credit Score: 750
- Employment: Employed
```

### Expected Results
1. ✅ Register successful
2. ✅ Auto login after registration
3. ✅ Dashboard shows 0 applications
4. ✅ Apply for loan
5. ✅ AI predicts: Approved (high credit score)
6. ✅ Loan appears in history with status

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Connect GitHub repository
# 4. Add environment variables:
#    - MONGO_URI
#    - JWT_SECRET
#    - etc.
# 5. Deploy!

# Frontend will be served from /client
# Backend from /server (if using API routes)
```

### Deploy Backend Separately
```bash
# Option 1: Heroku
heroku create your-app-name
git push heroku main

# Option 2: Railway
railway link
railway up

# Option 3: Render
# Connect GitHub repo, set build command: npm start
```

### Deploy Frontend
```bash
# GitHub Pages
npm run build
git add dist
git commit -m "Deploy"
git push

# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

---

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Express server with all routes |
| `models/User.js` | User schema & authentication |
| `models/Loan.js` | Loan schema & structure |
| `index.html` | Landing page |
| `login.html` | Login form |
| `register.html` | Registration form |
| `dashboard.html` | User dashboard |
| `apply.html` | Loan application form |
| `history.html` | Loan history/tracking |
| `style.css` | All styling (3000+ lines) |
| `script.js` | Frontend JavaScript logic |
| `test-db.js` | MongoDB connection test |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 Environment Variables

### Required
```env
MONGO_URI=your_mongodb_atlas_connection_string
```

### Optional but Recommended
```env
JWT_SECRET=your_secret_key (change in production)
JWT_EXPIRE=7d
ML_API_URL=http://localhost:5000/predict
PORT=5001
NODE_ENV=development
```

---

## 📞 Support

For issues:
1. Check **Troubleshooting** section above
2. Read **DATABASE_SETUP.md** for MongoDB help
3. Check browser console (F12)
4. Check server logs in terminal
5. See **MONGO_QUICK_START.md** for quick help

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🎉 You're All Set!

Your complete MERN stack application is ready to use. Start with:

1. **DATABASE_SETUP.md** - Set up MongoDB Atlas
2. **MONGO_QUICK_START.md** - Quick reference
3. **This file** - Full documentation
4. **test-db.js** - Verify your setup

**Happy coding! 🚀**

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready
