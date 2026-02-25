# 🚀 CreditWise MERN Stack - Setup Guide

## Project Structure

```
creditwise-loan-system/
├── client/
│   ├── index.html          # Home page
│   ├── apply.html          # Loan application form
│   ├── style.css           # Styling
│   └── script.js           # Frontend JavaScript
├── server/
│   ├── server.js           # Express server
│   ├── models/
│   │   └── Loan.js         # Mongoose Loan model
│   ├── package.json        # Server dependencies
│   └── .env                # Environment variables
└── ml_api/
    ├── app.py              # Flask ML API
    └── model.pkl           # Trained ML model
```

---

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.7 or higher)
- **MongoDB** (local or cloud instance)
- **pip** (Python package manager)

---

## 🔧 Installation & Setup

### 1️⃣ **Server Setup (Node.js + Express)**

```bash
cd server

# Install dependencies
npm install

# Create .env file with MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/creditwise
# PYTHON_API_URL=http://localhost:5000
# PORT=5001
# JWT_SECRET=your_secret_key

# Start server
npm run dev
# or
npm start
```

**Server will run on:** `http://localhost:5001`

### 2️⃣ **Python ML API Setup**

```bash
cd ml_api

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors numpy pandas scikit-learn joblib

# Run Flask app
python app.py
```

**ML API will run on:** `http://localhost:5000`

### 3️⃣ **Client Setup (Static Files)**

The client is built with vanilla HTML, CSS, and JavaScript. No build process needed!

#### Option A: Using Python's Simple Server
```bash
cd client

# Python 3
python -m http.server 8000

# or Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Using Node's http-server
```bash
cd client

# Install http-server globally
npm install -g http-server

# Start server
http-server -p 8000
```

#### Option C: Using Live Server (VS Code Extension)
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

**Client will run on:** `http://localhost:8000`

---

## 📡 API Endpoints

### Loan Applications

**Submit Loan Application**
```
POST /api/loans/apply
Content-Type: application/json

{
  "applicant_id": "APP001",
  "applicant_income": 500000,
  "coapplicant_income": 0,
  "employment_status": "Salaried",
  "age": 28,
  "marital_status": "Single",
  "dependents": 0,
  "credit_score": 750,
  "existing_loans": 0,
  "loan_amount": 500000,
  "loan_term": 60,
  "home_ownership": "Rent",
  "years_employed": 5,
  "email": "user@example.com",
  "phone": "9876543210"
}
```

**Get Loan Status**
```
GET /api/loans/{applicantId}
```

**Get All Loans (Admin)**
```
GET /api/loans
```

**Get Statistics**
```
GET /api/loans/stats/overview
```

**Update Loan Status**
```
PUT /api/loans/{applicantId}
Content-Type: application/json

{
  "status": "Approved",
  "prediction": "Approved"
}
```

---

## 🤖 ML API Endpoints

**Single Prediction**
```
POST /predict
Content-Type: application/json

{
  "applicant_income": 500000,
  "coapplicant_income": 0,
  "employment_status": "Salaried",
  "age": 28,
  "marital_status": "Single",
  "dependents": 0,
  "credit_score": 750,
  "existing_loans": 0,
  "loan_amount": 500000,
  "loan_term": 60,
  "home_ownership": "Rent",
  "years_employed": 5
}
```

**Batch Predictions**
```
POST /batch-predict
Content-Type: application/json

{
  "applications": [
    { ... },
    { ... }
  ]
}
```

---

## 🗄️ MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB service
# On Windows (Command Prompt as Admin):
net start MongoDB

# On macOS (using Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/creditwise
   ```

---

## 🧪 Testing the Application

### 1. Start All Services
```bash
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - ML API
cd ml_api && python app.py

# Terminal 3 - Client
cd client && python -m http.server 8000
```

### 2. Open Application
- Navigate to `http://localhost:8000` in browser
- Fill out the loan application form
- Submit and get instant prediction
- Check application status with your Applicant ID

---

## 📊 Database Schema

### Loan Collection
```javascript
{
  _id: ObjectId,
  applicant_id: String (unique),
  applicant_income: Number,
  coapplicant_income: Number,
  employment_status: String,
  age: Number,
  marital_status: String,
  dependents: Number,
  credit_score: Number,
  existing_loans: Number,
  loan_amount: Number,
  loan_term: Number,
  home_ownership: String,
  years_employed: Number,
  prediction: String ("Approved" / "Rejected"),
  confidence_score: Number,
  status: String ("Pending" / "Processed" / "Approved" / "Rejected"),
  email: String,
  phone: String,
  created_at: Date,
  updated_at: Date
}
```

---

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **CORS**: Configure CORS for production
3. **Validation**: All inputs are validated on server side
4. **JWT**: Implement JWT for authentication (optional)
5. **Encryption**: Hash sensitive data before storage

---

## 📈 Future Enhancements

- [ ] User authentication & login
- [ ] Admin dashboard
- [ ] Application history
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced ML model improvements
- [ ] React frontend
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 🆘 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

### ML API Not Connecting
- Ensure Flask app is running on port 5000
- Check `PYTHON_API_URL` in `.env`
- Look for Python error logs

### CORS Errors
- Verify frontend URL matches CORS config
- Check browser console for details

### Form Not Submitting
- Open browser DevTools (F12)
- Check Network tab for API errors
- Verify all required fields are filled

---

## 📞 Support

For issues or questions:
1. Check error logs in terminal
2. Review browser console (F12)
3. Verify all services are running
4. Check environment variables

---

**Happy Lending! 💳🎉**
