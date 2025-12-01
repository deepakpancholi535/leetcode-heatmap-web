# 🔧 Troubleshooting Guide

## Issue: "Account creation failed" on Signup

### Step 1: Test MongoDB Connection

Run this command in your project root:
```bash
node test-connection.js
```

**Expected Output:**
```
✅ MongoDB connected successfully!
Database: leetcode-heatmap
Host: cluster0-shard-00-00.xxxxx.mongodb.net
```

**If you see error:**
```
❌ MongoDB connection failed:
MongooseServerSelectionError: Could not connect to any servers
```

**Fix:**
1. Check your `.env` file exists in root directory
2. Verify `MONGODB_URI` is correct
3. Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
4. Check database user has read/write permissions

---

### Step 2: Check .env File

Your `.env` file should look like:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/leetcode-heatmap?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

**Common Mistakes:**
- ❌ Password contains special characters not URL-encoded
- ❌ Missing database name before `?retryWrites`
- ❌ Extra spaces in the URI
- ❌ Wrong cluster URL

**Fix Special Characters in Password:**
If your password is `P@ssw0rd!`, encode it:
```
@ → %40
! → %21
# → %23
$ → %24
% → %25
```

Example:
```
mongodb+srv://user:P%40ssw0rd%21@cluster.mongodb.net/leetcode-heatmap
```

---

### Step 3: Check Backend Logs

Start your server and watch for errors:
```bash
npm run server
```

**Look for:**
```
Server running on port 5000
MongoDB connected
```

**Common Errors:**

#### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

#### Error: "Cannot find module 'bcryptjs'"
```bash
npm install bcryptjs
```

#### Error: "Port 5000 already in use"
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

---

### Step 4: Test API Directly

Use curl or Postman to test signup:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "leetcodeUsername": null
  }
}
```

**Error Responses:**

#### 400 - Validation Error
```json
{
  "errors": [
    {
      "msg": "Please enter a valid email",
      "param": "email"
    }
  ]
}
```
**Fix:** Check email format and password length (min 6 chars)

#### 400 - User Already Exists
```json
{
  "message": "User already exists"
}
```
**Fix:** Use different email or delete existing user from MongoDB

#### 500 - Server Error
```json
{
  "message": "Server error"
}
```
**Fix:** Check backend terminal for detailed error

---

### Step 5: Check Frontend-Backend Connection

#### Verify Proxy Setting

In `client/package.json`, ensure:
```json
{
  "proxy": "http://localhost:5000"
}
```

#### Check API Call

In browser DevTools → Network tab:
1. Try to signup
2. Look for `register` request
3. Check:
   - **Status**: Should be 200 (success) or 400/500 (error)
   - **Request URL**: Should be `http://localhost:5000/api/auth/register`
   - **Request Payload**: Should contain name, email, password
   - **Response**: Check error message

---

### Step 6: Common Fixes

#### Fix 1: Reinstall Dependencies
```bash
# Root directory
rm -rf node_modules package-lock.json
npm install

# Client directory
cd client
rm -rf node_modules package-lock.json
npm install
cd ..
```

#### Fix 2: Clear Browser Cache
- Chrome: Ctrl+Shift+Delete → Clear cache
- Or use Incognito mode

#### Fix 3: Restart Everything
```bash
# Stop all processes (Ctrl+C)

# Restart MongoDB (if local)
mongod

# Restart backend
npm run server

# In new terminal, restart frontend
cd client
npm start
```

#### Fix 4: Check CORS
If you see CORS error, update `server/index.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

### Step 7: MongoDB Atlas Checklist

Login to [MongoDB Atlas](https://cloud.mongodb.com):

1. **Network Access**
   - Go to Network Access
   - Ensure `0.0.0.0/0` is whitelisted
   - Or add your current IP

2. **Database Access**
   - Go to Database Access
   - Check user exists
   - Verify password is correct
   - Ensure role is "Read and write to any database"

3. **Database**
   - Go to Database → Browse Collections
   - Check if `leetcode-heatmap` database exists
   - After first signup, `users` collection should appear

---

### Step 8: Enable Detailed Error Logging

Update `server/routes/auth.js` register route:

```javascript
router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required')
], async (req, res) => {
  console.log('📝 Register request received:', req.body); // Add this
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array()); // Add this
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('❌ User already exists:', email); // Add this
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ email, password, name });
    await user.save();
    console.log('✅ User created:', email); // Add this

    const payload = { user: { id: user.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        console.error('❌ JWT error:', err); // Add this
        throw err;
      }
      console.log('✅ Token generated'); // Add this
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          leetcodeUsername: user.leetcodeUsername
        }
      });
    });
  } catch (err) {
    console.error('❌ Server error:', err); // Add this
    res.status(500).json({ message: 'Server error', error: err.message }); // Modified
  }
});
```

Now check terminal for detailed logs when you try to signup.

---

## Quick Diagnosis

Run these commands and share the output:

```bash
# 1. Test MongoDB connection
node test-connection.js

# 2. Check if server is running
curl http://localhost:5000/health

# 3. Test signup API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

---

## Still Having Issues?

Share these details:

1. **MongoDB connection test output**
2. **Backend terminal logs** (when you try signup)
3. **Browser console errors** (F12 → Console)
4. **Network tab** (F12 → Network → register request → Response)

I'll help you fix it! 🚀
