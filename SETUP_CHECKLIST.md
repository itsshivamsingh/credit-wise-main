# CreditWise MERN - Setup Checklist

Complete this checklist to get your full-stack application running!

---

## Phase 1: Database Setup ✨

- [ ] Visit https://www.mongodb.com/cloud/atlas
- [ ] Sign up or Sign in
- [ ] Create M0 Sandbox cluster (free)
- [ ] Wait for cluster to be ready (5-10 minutes)
- [ ] Create database user (username & password)
- [ ] Add your IP to Network Access List
- [ ] Click "Connect" → "Drivers" → Copy connection string
- [ ] Note your connection string (save it somewhere safe)

---

## Phase 2: Project Configuration 🔧

### Environment Variables Setup

#### Option A: If using Vercel Dashboard
- [ ] Go to your Vercel project settings
- [ ] Navigate to "Environment Variables"
- [ ] Add `MONGO_URI` with your MongoDB connection string
- [ ] Add `JWT_SECRET` (any secure string)
- [ ] Add `JWT_EXPIRE` as `7d`

#### Option B: If developing locally
- [ ] Open `server/.env` file
- [ ] Replace `MONGO_URI` with your connection string
  ```
  MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/creditwise?retryWrites=true&w=majority
  ```
- [ ] Keep other variables as default (or customize if needed)

---

## Phase 3: Backend Setup 🖥️

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Test database connection
node test-db.js
```

- [ ] Successfully ran `npm install`
- [ ] All dependencies installed without errors
- [ ] `test-db.js` shows "✅ SUCCESS: Connected to MongoDB!"

If test-db fails, check:
- [ ] MONGO_URI is correct in .env
- [ ] Your IP is whitelisted in MongoDB Atlas
- [ ] MongoDB cluster is running in Atlas
- [ ] Username and password in URI are correct

---

## Phase 4: Start Backend Server 🚀

```bash
npm start
```

- [ ] Server started successfully
- [ ] Console shows "Server running on port 5001"
- [ ] No errors in terminal

Keep this terminal open while testing!

---

## Phase 5: Frontend Setup 🎨

### Option A: Using Python
```bash
cd client
python -m http.server 8000
```

### Option B: Using npx
```bash
cd client
npx serve
```

### Option C: Using VS Code Live Server
- [ ] Install "Live Server" extension
- [ ] Right-click on `client/index.html`
- [ ] Click "Open with Live Server"

- [ ] Frontend is running and accessible
- [ ] Can access http://localhost:8000 (or your port)

---

## Phase 6: Feature Testing ✅

### Test 1: User Registration
- [ ] Go to http://localhost:8000
- [ ] Click "Create Account"
- [ ] Fill in all fields:
  - Email: `test@example.com`
  - Full Name: `Test User`
  - Phone: `9876543210`
  - Employment: `Employed`
  - Password: `Test@123`
- [ ] Click Register
- [ ] Auto-login to dashboard

**Expected**: Dashboard appears with 0 applications

### Test 2: Dashboard
- [ ] View your profile information
- [ ] See statistics (all should be 0)
- [ ] Verify "Member Since" date is today

**Expected**: All stats show 0, profile is complete

### Test 3: Loan Application
- [ ] Click "Apply Loan" in navigation
- [ ] Fill in loan details:
  - Loan Amount: `500000`
  - Loan Term: `60`
  - Monthly Income: `50000`
  - Credit Score: `750`
  - Employment: `Employed`
- [ ] Click Submit
- [ ] See instant AI prediction (should be "Approved" for this data)

**Expected**: Loan submitted successfully with approval status

### Test 4: Loan History
- [ ] Click "Loan History"
- [ ] See your loan in the table
- [ ] Status should be "Approved" (green badge)
- [ ] Click "View Details"

**Expected**: Modal shows complete loan details

### Test 5: Logout & Login
- [ ] Click "Logout" button
- [ ] Should redirect to login page
- [ ] Use same email and password to login
- [ ] Should return to dashboard

**Expected**: Login/logout works, retains data

### Test 6: Database Verification
- [ ] Go to MongoDB Atlas
- [ ] Click your cluster
- [ ] Click "Collections"
- [ ] Expand "creditwise" database
- [ ] Should see:
  - [ ] `users` collection with your test user
  - [ ] `loans` collection with your test loan

**Expected**: Both collections exist with data

---

## Phase 7: Data Verification 🔍

Check MongoDB Collections:

### Users Collection
```
{
  _id: ObjectId
  email: "test@example.com"
  password: (hashed)
  fullName: "Test User"
  phone: "9876543210"
  employment: "Employed"
  createdAt: (today's date)
  isActive: true
}
```

### Loans Collection
```
{
  _id: ObjectId
  userId: (reference to user)
  loanAmount: 500000
  loanTerm: 60
  monthlyIncome: 50000
  creditScore: 750
  employmentType: "Employed"
  status: "Approved"
  mlScore: (0-1)
  appliedAt: (today's date)
}
```

---

## Phase 8: Advanced Testing (Optional)

### Test Low Credit Score Rejection
- [ ] Log out
- [ ] Register new user with email `bad-credit@example.com`
- [ ] Apply for loan with Credit Score: `550`
- [ ] Should be "Rejected"

### Test Multiple Loans
- [ ] Apply for 2-3 loans with different amounts
- [ ] Check history shows all loans
- [ ] Dashboard stats update correctly
  - Total Applications: 3
  - Approved: (count)
  - Rejected: (count)

### Test Different Employment Types
- [ ] Apply loans with:
  - Employed
  - Self-Employed
  - Unemployed
- [ ] All should submit successfully

---

## Phase 9: Production Readiness 🚢

Before deploying:

- [ ] Change `JWT_SECRET` to a strong unique value
- [ ] Change `NODE_ENV` to `production`
- [ ] Test all features one more time
- [ ] Verify database backups in Atlas
- [ ] Review security settings
- [ ] Check all environment variables are set
- [ ] Remove test data from production database

---

## Common Issues & Fixes

### ❌ "Cannot connect to database"
- [ ] Check MONGO_URI in .env matches Atlas connection string
- [ ] Verify IP is whitelisted in Atlas Network Access
- [ ] Check cluster is running in MongoDB Atlas
- [ ] Ensure special characters in password are URL-encoded

### ❌ "Server won't start"
- [ ] Check Port 5001 is not in use: `lsof -i :5001`
- [ ] Run `npm install` again
- [ ] Check Node.js version: `node --version` (should be v14+)

### ❌ "Can't register user"
- [ ] Phone must be exactly 10 digits
- [ ] Email must be valid format
- [ ] Password must be at least 6 characters
- [ ] Email must not already exist

### ❌ "Frontend can't reach backend"
- [ ] Ensure backend is running on port 5001
- [ ] Check `API_URL` in script.js: `http://localhost:5001/api`
- [ ] Try accessing `http://localhost:5001/api/health` in browser
- [ ] Check CORS is enabled in server.js

### ❌ "Data not saving to database"
- [ ] Check database connection is successful (run test-db.js)
- [ ] Look at server terminal for error messages
- [ ] Check browser console (F12) for errors
- [ ] Verify user is logged in (token exists)

---

## Success Indicators ✨

You're done when you see:

✅ Backend server running on port 5001  
✅ Frontend accessible on port 8000  
✅ Can register and login  
✅ Can apply for loans  
✅ See instant AI predictions  
✅ Loans appear in history  
✅ Data persists in MongoDB Atlas  
✅ Dashboard shows correct statistics  
✅ All pages are responsive  
✅ No console errors (F12)

---

## Next Steps 🚀

1. **Customize the application**
   - Change colors in style.css
   - Update company name and logo
   - Modify loan criteria in backend

2. **Add more features**
   - Email notifications
   - Document upload
   - PDF generation for loans
   - Admin dashboard

3. **Deploy to production**
   - Choose hosting (Vercel, Heroku, Railway)
   - Set up CI/CD pipeline
   - Enable HTTPS
   - Configure custom domain

4. **Improve security**
   - Add rate limiting
   - Implement 2FA
   - Add password reset
   - Enable logging and monitoring

---

## Documentation Files

Keep these files handy:

📖 **MERN_README.md** - Complete project documentation  
🚀 **MONGO_QUICK_START.md** - Quick reference guide  
🗄️ **DATABASE_SETUP.md** - Detailed MongoDB Atlas setup  
✅ **SETUP_CHECKLIST.md** - This file!

---

## Support Resources

📚 MongoDB Docs: https://docs.mongodb.com/atlas/  
🚀 Express Docs: https://expressjs.com/  
📝 Mongoose Docs: https://mongoosejs.com/  
💻 Node.js Docs: https://nodejs.org/docs/  

---

**Congratulations! Your full MERN stack application is ready! 🎉**

Questions? Check the documentation files or revisit the setup steps above.

**Happy coding! 💻**
