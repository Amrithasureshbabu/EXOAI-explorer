# ExoAI Explorer - Backend Authentication System

A comprehensive space exploration website with 3D visualization, AI analysis, and secure user authentication.

## Features

### Frontend
- 🌌 **3D Space Tour Mode** - Interactive 3D star map with real NASA data
- 🪐 **AI Planet Detection** - Machine learning-powered exoplanet discovery
- 📊 **Data Visualization** - Brightness curves and planet profiles
- 🏆 **Gamification** - Achievements, leaderboards, and progress tracking
- 🎨 **Modern UI** - Space-themed glassmorphism design

### Backend
- 🔐 **Secure Authentication** - JWT-based login/signup system
- 🗄️ **SQLite Database** - User management and data persistence
- 🛡️ **Security Features** - Password hashing, rate limiting, input validation
- 📈 **User Analytics** - Progress tracking and achievement system
- 🔄 **RESTful API** - Clean API endpoints for all operations

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd exoai-explorer
   npm install
   ```

2. **Start the backend server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

3. **Access the application**
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:3000 (served by Express)
   - Health Check: http://localhost:3000/api/health

### Default Configuration

The application uses these default settings:
- **Port**: 3000
- **Database**: SQLite (./db/users.db)
- **JWT Secret**: Change in production!
- **CORS**: Enabled for localhost:8005

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/verify-token` - Verify JWT token
- `GET /api/profile` - Get user profile

### User Data
- `GET /api/user-stats` - Get user statistics
- `POST /api/user-stats` - Update user statistics
- `GET /api/achievements` - Get user achievements
- `POST /api/achievements` - Unlock achievement

### System
- `GET /api/health` - Health check endpoint

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1
);
```

### User Stats Table
```sql
CREATE TABLE user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    analyses INTEGER DEFAULT 0,
    discoveries INTEGER DEFAULT 0,
    stars_explored INTEGER DEFAULT 0,
    uploads INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### User Achievements Table
```sql
CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    achievement_id TEXT NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Security Features

### Password Security
- **bcrypt hashing** with 12 salt rounds
- **Password validation** requiring uppercase, lowercase, and numbers
- **Minimum length** of 6 characters

### API Security
- **Rate limiting** (100 requests per 15 minutes)
- **Helmet.js** for security headers
- **CORS protection** with configurable origins
- **Input validation** using express-validator
- **JWT tokens** with 24-hour expiration

### Session Management
- **SQLite session store** for persistent sessions
- **HTTP-only cookies** for session security
- **Automatic session cleanup** on logout

## Development

### Project Structure
```
exoai-explorer/
├── server.js              # Main Express server
├── config.js              # Configuration settings
├── package.json           # Dependencies and scripts
├── db/                    # SQLite database files
│   ├── users.db          # User data
│   └── sessions.db       # Session data
└── public/               # Frontend files
    ├── index.html        # Main application
    ├── style.css         # Styling
    ├── script.js         # Frontend logic
    └── auth.js           # Authentication client
```

### Environment Variables
Create a `.env` file (optional):
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8005
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## Usage Examples

### User Registration
```javascript
const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'spaceexplorer',
        email: 'user@example.com',
        password: 'SecurePass123'
    })
});
```

### User Login
```javascript
const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'spaceexplorer',
        password: 'SecurePass123'
    })
});

const { token, user } = await response.json();
```

### Authenticated Request
```javascript
const response = await fetch('/api/user-stats', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

## Production Deployment

### Security Checklist
- [ ] Change JWT_SECRET to a secure random string
- [ ] Set NODE_ENV=production
- [ ] Configure HTTPS
- [ ] Update CORS origins
- [ ] Set up proper database backups
- [ ] Configure rate limiting for your use case

### Recommended Hosting
- **Heroku** - Easy deployment with add-ons
- **DigitalOcean** - VPS with full control
- **AWS** - Scalable cloud infrastructure
- **Vercel** - Serverless deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**ExoAI Explorer** - Exploring the cosmos with AI-powered discovery! 🚀
