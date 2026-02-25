# CreditWise - System Architecture

Complete overview of how all components work together.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     INTERNET / USERS                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  CLIENT (PORT 8000)
        │  HTML/CSS/JS    │
        │  - index.html   │
        │  - login.html   │
        │  - register.html│
        │  - apply.html   │
        │  - history.html │
        │  - dashboard.html
        │  - script.js    │
        │  - style.css    │
        └────────┬────────┘
                 │ HTTP/HTTPS Requests
                 │ JSON Payloads
                 ▼
        ┌─────────────────────────┐
        │ SERVER (PORT 5001)       │
        │ Express.js + Node.js     │
        │                         │
        │ Routes:                 │
        │ ├─ /api/auth/*          │
        │ │  - register           │
        │ │  - login              │
        │ │  - logout             │
        │ │  - me                 │
        │ ├─ /api/loans/*         │
        │ │  - apply              │
        │ │  - history            │
        │ │  - detail             │
        │ │  - update             │
        │ └─ /api/stats/*         │
        │    - dashboard          │
        └────────┬────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    ┌──────────────┐  ┌────────────────────┐
    │ MONGODB      │  │ ML API (Optional)  │
    │ ATLAS        │  │ PORT 5000          │
    │ (Cloud)      │  │ Python + Flask     │
    │              │  │                    │
    │ Collections: │  │ ML Model for       │
    │ • users      │  │ Loan Prediction    │
    │ • loans      │  └────────────────────┘
    └──────────────┘
```

---

## 📊 Data Flow Diagram

### User Registration
```
User Input (register.html)
    ↓
JavaScript validates input
    ↓
POST /api/auth/register
    ↓
Server receives data
    ↓
Check if email exists
    ↓
Hash password (bcrypt)
    ↓
Save User to MongoDB
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Store token in localStorage
    ↓
Redirect to dashboard
```

### Loan Application
```
User Input (apply.html)
    ↓
JavaScript validates
    ↓
Retrieve JWT from localStorage
    ↓
POST /api/loans/apply
    + Authorization: Bearer <token>
    ↓
Server verifies token
    ↓
Extract userId from token
    ↓
Send to ML API (optional)
    ↓
Get prediction (Approved/Rejected)
    ↓
Save Loan to MongoDB
    ↓
Return result with mlScore
    ↓
Show result to user
    ↓
Update UI with status
```

### View Loan History
```
User clicks "Loan History"
    ↓
JavaScript retrieves token
    ↓
GET /api/loans/history
    + Authorization: Bearer <token>
    ↓
Server verifies token
    ↓
Query MongoDB for user's loans
    ↓
Filter by userId
    ↓
Return all loans
    ↓
JavaScript renders table
    ↓
User sees all applications
```

---

## 🗄️ Database Schema Relationships

```
┌──────────────────────────────┐
│       USERS COLLECTION       │
├──────────────────────────────┤
│ _id          (ObjectId)      │
│ email        (String)        │ ← UNIQUE
│ password     (String)        │ ← HASHED
│ fullName     (String)        │
│ phone        (String)        │
│ employment   (String)        │
│ createdAt    (Date)          │
│ lastLogin    (Date)          │
│ isActive     (Boolean)       │
└──────────────────────────────┘
           │
           │ Referenced by
           │
           ▼
┌──────────────────────────────┐
│      LOANS COLLECTION        │
├──────────────────────────────┤
│ _id              (ObjectId)  │
│ userId           (ObjectId)  │ ← Foreign Key
│ loanAmount       (Number)    │
│ loanTerm         (Number)    │
│ monthlyIncome    (Number)    │
│ creditScore      (Number)    │
│ employmentType   (String)    │
│ status           (String)    │
│ mlScore          (Number)    │
│ appliedAt        (Date)      │
│ updatedAt        (Date)      │
└──────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌────────────────────────────────────┐
│    USER LOGS IN                    │
│  (email + password)                │
└─────────────┬──────────────────────┘
              │
              ▼
┌────────────────────────────────────┐
│  SERVER: Find user by email        │
└─────────────┬──────────────────────┘
              │
              ▼
        ┌──────────┐
        │ User     │
        │ Exists?  │
        └┬────────┬┘
         │ NO     │ YES
         ▼        ▼
       REJECT   Compare Password
                  │
                  ▼
          ┌───────────────┐
          │ Password      │
          │ Match?        │
          └┬──────────┬───┘
            │ NO      │ YES
            ▼         ▼
          REJECT   Generate JWT
                     │
                     ▼
                ┌──────────────────────┐
                │ JWT Token:           │
                │ Header.Payload.Sign  │
                │ Expires in 7 days    │
                └──────────┬───────────┘
                           │
                           ▼
                    ┌────────────────┐
                    │ Return Token   │
                    │ + User Data    │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Client Stores  │
                    │ Token in Local │
                    │ Storage        │
                    └────────────────┘
```

### Using JWT Token for Protected Requests

```
┌──────────────────────────┐
│  Client: GET /api/loans  │
│  Header:                 │
│  Authorization:          │
│  Bearer <JWT_TOKEN>      │
└──────────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Server: Receive Req  │
    │ Extract token from   │
    │ Authorization header │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Verify Token         │
    │ (Check signature &   │
    │ expiration)          │
    └────┬────────────────┬┘
         │ INVALID        │ VALID
         ▼                ▼
       401              Extract userId
      REJECT            │
                        ▼
                   Use userId to query
                   Loans from MongoDB
                        │
                        ▼
                   Return user's loans
                        │
                        ▼
                   Client receives data
```

---

## 🔄 Request-Response Cycle

### Example: Register New User

#### REQUEST
```javascript
// client/script.js
fetch('http://localhost:5001/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123',
    fullName: 'John Doe',
    phone: '9876543210',
    employment: 'Employed'
  })
})
```

#### SERVER PROCESSING
```javascript
// server/server.js
app.post('/api/auth/register', async (req, res) => {
  // 1. Validate input
  // 2. Check if email exists
  // 3. Create new User document
  // 4. Hash password
  // 5. Save to MongoDB
  // 6. Generate JWT
  // 7. Return response
})
```

#### RESPONSE
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "9876543210",
    "employment": "Employed",
    "createdAt": "2024-02-15T10:30:00Z"
  }
}
```

#### CLIENT PROCESSING
```javascript
// Store token
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// Redirect to dashboard
window.location.href = 'dashboard.html';
```

---

## 🔌 API Endpoints Structure

```
BASE URL: http://localhost:5001/api

AUTHENTICATION
├── POST /auth/register
│   Input:  { email, password, fullName, phone, employment }
│   Output: { token, user }
│
├── POST /auth/login
│   Input:  { email, password }
│   Output: { token, user }
│
├── POST /auth/logout
│   Input:  (token in header)
│   Output: { message }
│
└── GET /auth/me
    Input:  (token in header)
    Output: { user object }

LOANS (All protected - require token)
├── POST /loans/apply
│   Input:  { loanAmount, loanTerm, monthlyIncome, creditScore, employmentType }
│   Output: { loan, prediction, confidenceScore }
│
├── GET /loans/history
│   Input:  (token in header)
│   Output: { totalApplications, loans[] }
│
├── GET /loans/:id
│   Input:  (token in header)
│   Output: { loan object }
│
├── PATCH /loans/:id
│   Input:  { status }
│   Output: { loan }
│
└── GET /stats/dashboard
    Input:  (token in header)
    Output: { user info, stats }
```

---

## 🌐 Frontend File Purposes

```
client/
├── index.html        Landing page
│                    - Hero section
│                    - Features
│                    - CTA button
│                    - Navigation
│
├── login.html       Login page
│                    - Email field
│                    - Password field
│                    - "Forgot password" link
│                    - "Create account" link
│
├── register.html    Registration page
│                    - Form fields
│                    - Validation
│                    - Password confirmation
│
├── dashboard.html   User dashboard
│                    - Welcome message
│                    - Statistics cards
│                    - Profile section
│                    - Quick actions
│
├── apply.html       Loan application
│                    - Application form
│                    - Input validation
│                    - Submit button
│                    - Result display
│
├── history.html     Loan history
│                    - Loans table
│                    - Filter by status
│                    - View details button
│                    - Modal for details
│
├── script.js        All JavaScript logic
│                    - API communication
│                    - Form handling
│                    - Token management
│                    - Page navigation
│
├── style.css        All styling
│                    - Responsive design
│                    - Component styles
│                    - Color scheme
│                    - Mobile/tablet/desktop
│
└── (images, etc)    Assets
```

---

## 🖥️ Backend File Purposes

```
server/
├── server.js        Main Express application
│                    - Route definitions
│                    - Middleware setup
│                    - Error handling
│                    - Server startup
│
├── models/
│   ├── User.js      User Mongoose schema
│                    - Fields & validation
│                    - Password hashing
│                    - Authentication methods
│
│   └── Loan.js      Loan Mongoose schema
│                    - Fields & validation
│                    - User relationship
│                    - Status tracking
│
├── package.json     Dependencies
│                    - express
│                    - mongoose
│                    - bcryptjs
│                    - jsonwebtoken
│                    - cors
│                    - dotenv
│
├── .env             Configuration
│                    - MONGO_URI
│                    - JWT_SECRET
│                    - PORT
│                    - NODE_ENV
│
└── test-db.js       Database connection tester
                    - Verifies MongoDB connection
                    - Shows database info
                    - Helpful error messages
```

---

## 🔄 Component Interaction Diagram

```
┌─────────────────┐
│   index.html    │ ← Landing page
│  (Public page)  │
└────────┬────────┘
         │ Links to
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
    ┌─────────┐      ┌────────────┐      ┌──────────┐
    │ login   │      │ register   │      │ about    │
    │ .html   │      │ .html      │      │ (modal)  │
    └────┬────┘      └─────┬──────┘      └──────────┘
         │                 │
         └────────┬────────┘
                  │ JWT Token
                  │ localStorage
                  ▼
         ┌─────────────────┐
         │  dashboard.html │ ← User logged in
         │  (Protected)    │
         └────────┬────────┘
                  │ Navigation
         ┌────────┴────────┬──────────────┐
         │                 │              │
         ▼                 ▼              ▼
    ┌─────────┐      ┌──────────┐   ┌──────────┐
    │ apply   │      │ history  │   │ dashboard│
    │ .html   │      │ .html    │   │ .html    │
    └────┬────┘      └────┬─────┘   └──────────┘
         │                │
         └────────┬───────┘
                  │ API Calls
                  │ Token in header
                  ▼
         ┌─────────────────┐
         │ server.js       │
         │ (Express)       │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ MongoDB Atlas   │
         │ (Cloud DB)      │
         └─────────────────┘
```

---

## 🚀 Deployment Architecture

### Local Development
```
Your Computer
├── Port 8000: Frontend (http://localhost:8000)
├── Port 5001: Backend (http://localhost:5001)
├── Port 27017: Local MongoDB (if using local)
└── Internet: MongoDB Atlas (if using cloud)
```

### Production

```
┌──────────────────────────────────────┐
│          VERCEL (Hosting)            │
├──────────────────────────────────────┤
│  Frontend: Served as static files    │
│  Backend: Run as serverless functions│
└────────────────┬─────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  MongoDB Atlas  │
        │  (Cloud DB)     │
        │  (Auto backups) │
        │  (Auto scaling) │
        └─────────────────┘
```

---

## 📱 Mobile Responsiveness Flow

```
Client Browser
    ↓
Check viewport width
    ↓
Mobile (< 768px)
├── Single column layout
├── Touch-optimized buttons
├── Large input fields
└── Simplified navigation

Tablet (768px - 1024px)
├── Two column layout
├── Balanced spacing
└── Standard navigation

Desktop (> 1024px)
├── Three+ column layout
├── Full featured sidebar
├── Optimized spacing
└── Full navigation
```

---

## 🔒 Security Architecture

```
┌────────────────────────────────┐
│   CLIENT REQUEST               │
├────────────────────────────────┤
│ 1. Input Validation            │
│    - Check email format        │
│    - Check password length     │
│    - Trim whitespace           │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│   HTTPS TRANSMISSION           │
├────────────────────────────────┤
│ - Encrypted connection         │
│ - No plain text passwords      │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│   SERVER RECEPTION             │
├────────────────────────────────┤
│ 1. CORS validation             │
│ 2. Request body parsing        │
│ 3. Input sanitization          │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│   AUTHENTICATION               │
├────────────────────────────────┤
│ 1. Verify JWT token            │
│ 2. Extract userId              │
│ 3. User isolation              │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│   DATABASE OPERATION           │
├────────────────────────────────┤
│ 1. Parameterized queries       │
│ 2. No SQL injection            │
│ 3. Data validation             │
│ 4. Password hashing (bcrypt)   │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│   RESPONSE                     │
├────────────────────────────────┤
│ 1. No sensitive data exposed   │
│ 2. Secure headers              │
│ 3. HTTPS transmission          │
└────────────────────────────────┘
```

---

## 📊 Performance Optimization

```
CLIENT SIDE
├── Lazy loading (future)
├── Local storage caching
├── Minimize HTTP requests
├── Responsive images
└── CSS/JS minification

SERVER SIDE
├── Database indexing
├── Connection pooling
├── Response compression
├── Caching strategies
└── Error handling

NETWORK
├── HTTPS/TLS
├── CDN for static files
├── Minimize payload size
└── Compression (gzip)
```

---

This architecture ensures:
- ✅ Security (passwords hashed, JWT tokens, user isolation)
- ✅ Scalability (cloud database, microservices ready)
- ✅ Maintainability (clear separation of concerns)
- ✅ Responsiveness (mobile-first design)
- ✅ Reliability (error handling, validation)

---

**Architecture Version**: 1.0  
**Last Updated**: 2024
