# 🔥 LeetCode Heatmap Web App

Full-stack web application to track LeetCode progress with visual heatmap, user authentication, and responsive design. Built with MERN stack and ready to deploy on Render.

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT
- 🔗 **LeetCode Integration** - Link your LeetCode profile
- 📊 **Visual Heatmap** - GitHub-style contribution calendar
- 📈 **Statistics Dashboard** - Track solved problems by difficulty
- 🏆 **Global Ranking** - Display your LeetCode rank
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Production Ready** - Optimized for Render deployment

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- React Calendar Heatmap
- React Icons

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Helmet for security
- Rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/deepakpancholi535/leetcode-heatmap-web.git
cd leetcode-heatmap-web
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Environment Setup**
```bash
# Create .env file in root directory
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/leetcode-heatmap
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

6. **Access the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🚀 Deployment on Render

### Step 1: Prepare MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Whitelist all IPs (0.0.0.0/0) for Render

**Option B: Render MongoDB**
1. Create MongoDB instance on Render
2. Copy connection string

### Step 2: Deploy on Render

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Configure:
     - **Name**: leetcode-heatmap
     - **Environment**: Node
     - **Build Command**: `npm install && cd client && npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables**
   In Render dashboard, add:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-production-key
   NODE_ENV=production
   ```

4. **Deploy**
   - Click **Create Web Service**
   - Wait for deployment (5-10 minutes)
   - Your app will be live at: `https://your-app-name.onrender.com`

### Step 3: Custom Domain (Optional)

1. In Render dashboard, go to **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records as instructed

## 📱 Usage

### 1. Create Account
- Visit the app
- Click "Sign up"
- Enter name, email, and password

### 2. Link LeetCode Profile
- After login, enter your LeetCode username
- Click "Link Account"
- System verifies username exists

### 3. View Dashboard
- See your statistics (total solved, easy/medium/hard)
- View global ranking
- Explore 365-day submission heatmap
- Click username to visit LeetCode profile

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

### User
```
GET  /api/user/profile     - Get user profile (Protected)
PUT  /api/user/profile     - Update profile (Protected)
PUT  /api/user/leetcode    - Link LeetCode username (Protected)
```

### LeetCode
```
GET /api/leetcode/stats/:username  - Get LeetCode stats (Protected)
GET /api/leetcode/verify/:username - Verify username exists (Public)
```

## 🎨 Customization

### Change Color Scheme
Edit `client/src/index.css`:
```css
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Modify Heatmap Colors
Edit `client/src/components/Dashboard.css`:
```css
.react-calendar-heatmap .color-scale-1 { fill: #YOUR_COLOR; }
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP security headers with Helmet
- Rate limiting on API endpoints
- Input validation
- CORS protection

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  leetcodeUsername: String (optional),
  createdAt: Date,
  lastLogin: Date
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB is running
mongod --version

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017/leetcode-heatmap
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

### LeetCode API Not Working
- Verify username is correct
- Check LeetCode profile is public
- Try different username

## 🚧 Future Enhancements

- [ ] Dark mode toggle
- [ ] Multiple LeetCode profiles
- [ ] Problem difficulty filters
- [ ] Streak tracking
- [ ] Email notifications
- [ ] Social sharing
- [ ] Contest participation tracking
- [ ] Friend comparisons
- [ ] Export data as PDF

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/deepakpancholi535/leetcode-heatmap-web/issues)
- **Email**: deepakpancholianuj@gmail.com

## 🌟 Acknowledgments

- LeetCode for the GraphQL API
- React Calendar Heatmap library
- MongoDB Atlas for database hosting
- Render for deployment platform

---

**Built with ❤️ by Deepak Pancholi**

🔗 [Live Demo](https://your-app-name.onrender.com) | 📱 [iOS App](https://github.com/deepakpancholi535/leetcode-heatmap-ios)
