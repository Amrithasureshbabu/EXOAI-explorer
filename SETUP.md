# ExoAI Explorer Backend Setup Guide

## 🚀 Quick Setup Instructions

### Prerequisites
1. **Install Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - **Main App**: http://localhost:3000
   - **API Health**: http://localhost:3000/api/health
   - **Backend API**: http://localhost:3000/api/*

## 🔧 Manual Setup (if npm is not available)

### Option 1: Install Node.js
1. Go to https://nodejs.org/
2. Download and install Node.js LTS version
3. Restart your terminal/command prompt
4. Run the commands above

### Option 2: Use Python Server (Frontend Only)
If you only want to test the frontend without authentication:
```bash
# In the public directory
cd public
python -m http.server 8005
```
Then visit: http://localhost:8005

## 🗄️ Database Setup

The SQLite database will be created automatically when you first start the server:
- **Location**: `./db/users.db`
- **Sessions**: `./db/sessions.db`
- **Tables**: Created automatically on first run

## 🔐 Default Test Account

After starting the server, you can create an account or use these test credentials:

**Signup a new account:**
- Username: `testuser`
- Email: `test@example.com`
- Password: `TestPass123`

**Or login with existing account** (if you've created one)

## 📁 Project Structure

```
exoai-explorer/
├── server.js              # Main backend server
├── config.js              # Configuration
├── package.json           # Dependencies
├── README.md              # Full documentation
├── SETUP.md               # This setup guide
├── start-server.bat       # Windows startup script
├── test-backend.js        # Backend test script
├── db/                    # Database files (auto-created)
│   ├── users.db          # User data
│   └── sessions.db       # Session data
└── public/               # Frontend files
    ├── index.html        # Main application
    ├── style.css         # Styling
    ├── script.js         # Frontend logic
    └── auth.js           # Authentication client
```

## 🧪 Testing the Backend

1. **Health Check**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Test Script**
   ```bash
   node test-backend.js
   ```

3. **Browser Test**
   - Visit: http://localhost:3000/api/health
   - Should return: `{"status":"OK","message":"ExoAI Explorer Backend is running"}`

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8005
JWT_SECRET=your-secret-key-here
```

### Default Settings
- **Port**: 3000
- **Database**: SQLite (./db/users.db)
- **JWT Secret**: Default key (change in production!)
- **CORS**: Enabled for localhost:8005

## 🚨 Troubleshooting

### Common Issues

1. **"npm is not recognized"**
   - Install Node.js from https://nodejs.org/
   - Restart your terminal

2. **"Port 3000 already in use"**
   - Change PORT in config.js or .env file
   - Or kill the process using port 3000

3. **Database errors**
   - Delete the `db` folder and restart
   - Check file permissions

4. **CORS errors**
   - Update FRONTEND_URL in config.js
   - Ensure frontend is running on the correct port

### Getting Help

1. Check the console output for error messages
2. Verify all dependencies are installed: `npm list`
3. Test the health endpoint: http://localhost:3000/api/health
4. Check the README.md for detailed documentation

## 🎯 Next Steps

1. **Start the server**: `npm start`
2. **Open browser**: http://localhost:3000
3. **Create account**: Click "Login" → "Sign up"
4. **Explore features**: 
   - 3D Space Tour
   - AI Analysis
   - Achievements
   - Planet Discovery

## 🔒 Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Set NODE_ENV=production
- Configure proper CORS origins
- Use environment variables for secrets

---

**Ready to explore the cosmos?** 🚀 Start the server and begin your space exploration journey!
