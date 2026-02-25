# CreditWise - MongoDB Atlas Database Setup Guide

## Overview
This guide will help you set up MongoDB Atlas for the CreditWise MERN application. Your application is fully configured with MongoDB and Mongoose ORM.

---

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up** (or Sign In if you have an account)
3. Create a new account with your email or use Google/GitHub
4. Complete the registration process

---

## Step 2: Create a Cluster

1. After logging in, click **Create a Deployment**
2. Choose **M0 Sandbox** (Free tier - perfect for development)
3. Click **Create Deployment**
4. Select **Username and Password** authentication
5. Create a strong username and password
   - Username: `creditwise_admin` (example)
   - Password: Generate a strong password (save this!)
6. Click **Create User**
7. Add your IP address to the IP Access List
   - Click **Add My Current IP Address** 
   - Or add `0.0.0.0/0` to allow all IPs (for development only)
8. Click **Finish and Close**

---

## Step 3: Get Your Connection String

1. Click the **Connect** button on your cluster
2. Choose **Drivers**
3. Select **Node.js** as the driver
4. Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

---

## Step 4: Configure Environment Variables

### Option A: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project settings
2. Navigate to **Settings > Environment Variables**
3. Add a new variable:
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB connection string (replace `<password>` and `<dbname>`)
   - Example: `mongodb+srv://creditwise_admin:YourPassword123@cluster.mongodb.net/creditwise?retryWrites=true&w=majority`

4. Add other environment variables:
   - **JWT_SECRET**: Any strong secret key (e.g., `your-super-secret-jwt-key-change-in-production`)
   - **JWT_EXPIRE**: `7d`
   - **ML_API_URL**: `http://localhost:5000/predict`
   - **NODE_ENV**: `development`

### Option B: Local Development (.env file)

1. In the `server` folder, create/update `.env`:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/creditwise?retryWrites=true&w=majority

# ML API Configuration
ML_API_URL=http://localhost:5000/predict

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=credit-wise-jwt-secret-key-change-in-production
JWT_EXPIRE=7d
```

2. Replace the placeholders with your actual values

---

## Step 5: Database Collections Schema

Your application automatically creates these collections when you run it:

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  fullName: String,
  phone: String,
  employment: String,
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

### Loans Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (Reference to User),
  loanAmount: Number,
  loanTerm: Number (months),
  monthlyIncome: Number,
  creditScore: Number,
  employmentType: String,
  status: String (Approved, Rejected, Under Review, Pending),
  mlScore: Number (0-1),
  appliedAt: Date,
  updatedAt: Date
}
```

---

## Step 6: Start Your Application

### Terminal 1 - Start MongoDB ML API (if you have it set up)
```bash
cd ml_api
python app.py
```

### Terminal 2 - Start Express Server
```bash
cd server
npm install  # First time only
npm start
```

The server will start on `http://localhost:5001`

### Terminal 3 - Serve Client (Optional)
```bash
# Using Python
cd client
python -m http.server 8000

# Or using Node/npm
npx serve client
```

---

## Step 7: Test the Connection

1. Open `http://localhost:8000` (or your client URL)
2. Click **Register**
3. Fill in the form and submit
4. Check MongoDB Atlas Dashboard:
   - Click your cluster
   - Go to **Collections**
   - You should see `creditwise` database with `users` and `loans` collections

---

## Troubleshooting

### Connection Error: "connect ECONNREFUSED"
- **Cause**: MongoDB URI is incorrect or IP not whitelisted
- **Solution**: 
  - Verify your connection string
  - Check IP access list in Atlas (add `0.0.0.0/0` for development)

### Error: "MongoError: authentication failed"
- **Cause**: Wrong username or password in connection string
- **Solution**: 
  - Reset your password in MongoDB Atlas
  - Update the connection string

### Collections Not Creating
- **Cause**: Application never ran or crashed during startup
- **Solution**: 
  - Check server logs for errors
  - Ensure MongoDB connection is established
  - Try registering a new user to trigger collection creation

### IP Whitelist Issues
- **Solution**: In Atlas Dashboard:
  1. Go to **Network Access**
  2. Click **Edit**
  3. Add your IP or use `0.0.0.0/0` (less secure but works for development)

---

## Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong passwords** for MongoDB user
3. **Enable IP Whitelist** in production (don't use `0.0.0.0/0`)
4. **Rotate JWT_SECRET** periodically
5. **Use environment variables** for sensitive data
6. **Enable encryption** at rest in MongoDB Atlas (paid tier)

---

## API Endpoints

All endpoints require JWT token in header: `Authorization: Bearer <token>`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Loans
- `POST /api/loans/apply` - Apply for loan
- `GET /api/loans/history` - Get loan history
- `GET /api/loans/:id` - Get specific loan
- `PATCH /api/loans/:id` - Update loan status
- `GET /api/stats/dashboard` - Get dashboard stats

---

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Configure environment variables
3. ✅ Start the server
4. ✅ Test user registration and login
5. ✅ Apply for a loan
6. ✅ Check loan history
7. Set up ML API (optional for production deployment)
8. Deploy to production

---

## Support

For MongoDB Atlas help: https://docs.mongodb.com/atlas/
For your project debugging, check:
- Server logs in terminal
- Browser console (F12)
- MongoDB Atlas Collections tab

---

**Your MongoDB Atlas database is now ready to use! 🎉**
