# MongoDB Atlas Quick Start for CreditWise

## 🚀 Ultra-Quick Setup (5 minutes)

### 1. Go to MongoDB Atlas
```
https://www.mongodb.com/cloud/atlas
```

### 2. Create Free Cluster
- Sign up or sign in
- Create M0 Sandbox cluster
- Set username/password
- Add your IP address
- Wait for cluster to be ready

### 3. Get Connection String
- Click **Connect**
- Select **Drivers**
- Copy Node.js connection string

### 4. Add to Your Project
Replace this in `.env` or Vercel environment variables:
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/creditwise?retryWrites=true&w=majority
```

### 5. Run Your Server
```bash
cd server
npm install
npm start
```

### 6. Test It
- Go to http://localhost:8000
- Register a new user
- Check MongoDB Atlas Collections to see your data!

---

## 📊 Database Structure

### Users Table
```
Email (unique) → Password (hashed) → Name → Phone → Employment
```

### Loans Table  
```
User ID → Loan Amount → Term → Income → Credit Score → Status
```

---

## ⚡ Common Commands

### Check Collections in MongoDB Atlas
1. Click your cluster
2. Click **Collections** tab
3. See `creditwise` database with tables

### Reset Database
1. In Atlas, click **Collections**
2. Right-click collection → **Drop Collection**

### View Data
1. Collections tab
2. Click on table name
3. See all records

---

## 🔑 Environment Variables Needed

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_secret_key
JWT_EXPIRE=7d
ML_API_URL=http://localhost:5000/predict
PORT=5001
NODE_ENV=development
```

---

## ✅ What's Already Done

✅ User model with password hashing
✅ Loan model connected to users  
✅ Authentication routes (register, login)
✅ Loan application endpoints
✅ Database error handling
✅ All client pages ready

---

## 🎯 What to Do Next

1. **Get MongoDB Atlas running** ← You are here
2. Set MONGO_URI in environment
3. npm start in server folder
4. Test registration
5. Apply for loans
6. View history

---

## 🆘 Quick Fixes

**"MongoDB connection error"**
→ Check MONGO_URI in .env is correct

**"Authentication failed"**  
→ Verify username:password in connection string

**"IP not whitelisted"**
→ Add your IP in MongoDB Atlas Network Access

**"Collections not found"**
→ Just register a user, it creates them automatically!

---

**Ready? Start with Step 1 above! 🚀**
