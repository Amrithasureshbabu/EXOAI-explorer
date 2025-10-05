const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'exoai-explorer-secret-key-2024';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8005',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.db',
        dir: './db'
    }),
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization
const db = new sqlite3.Database('./db/users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME,
            is_active BOOLEAN DEFAULT 1
        )`);

        // User sessions table for additional tracking
        db.run(`CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            session_token TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            is_active BOOLEAN DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // User achievements table
        db.run(`CREATE TABLE IF NOT EXISTS user_achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            achievement_id TEXT NOT NULL,
            unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // User stats table
        db.run(`CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            analyses INTEGER DEFAULT 0,
            discoveries INTEGER DEFAULT 0,
            stars_explored INTEGER DEFAULT 0,
            uploads INTEGER DEFAULT 0,
            total_xp INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);
    });
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Validation middleware
const validateSignup = [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'ExoAI Explorer Backend is running' });
});

// Signup route
app.post('/api/signup', validateSignup, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(409).json({ error: 'Username or email already exists' });
            }

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert new user
            db.run(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                function(err) {
                    if (err) {
                        console.error('Error creating user:', err);
                        return res.status(500).json({ error: 'Failed to create user' });
                    }

                    // Create initial user stats
                    db.run(
                        'INSERT INTO user_stats (user_id) VALUES (?)',
                        [this.lastID],
                        (err) => {
                            if (err) {
                                console.error('Error creating user stats:', err);
                            }
                        }
                    );

                    res.status(201).json({ 
                        message: 'User created successfully',
                        userId: this.lastID
                    });
                }
            );
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
app.post('/api/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const { username, password } = req.body;

        // Find user by username or email
        db.get(
            'SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1',
            [username, username],
            async (err, user) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (!user) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Verify password
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Update last login
                db.run(
                    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                    [user.id]
                );

                // Generate JWT token
                const token = jwt.sign(
                    { 
                        userId: user.id, 
                        username: user.username,
                        email: user.email
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // Store session
                req.session.userId = user.id;
                req.session.username = user.username;

                res.json({
                    message: 'Login successful',
                    token: token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
    db.get(
        'SELECT id, username, email, created_at, last_login FROM users WHERE id = ?',
        [req.user.userId],
        (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user });
        }
    );
});

// Get user stats
app.get('/api/user-stats', authenticateToken, (req, res) => {
    db.get(
        'SELECT * FROM user_stats WHERE user_id = ?',
        [req.user.userId],
        (err, stats) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (!stats) {
                // Create default stats if none exist
                db.run(
                    'INSERT INTO user_stats (user_id) VALUES (?)',
                    [req.user.userId],
                    function(err) {
                        if (err) {
                            console.error('Error creating user stats:', err);
                            return res.status(500).json({ error: 'Failed to create user stats' });
                        }
                        res.json({
                            analyses: 0,
                            discoveries: 0,
                            starsExplored: 0,
                            uploads: 0,
                            xp: 0
                        });
                    }
                );
            } else {
                res.json({
                    analyses: stats.analyses,
                    discoveries: stats.discoveries,
                    starsExplored: stats.stars_explored,
                    uploads: stats.uploads,
                    xp: stats.total_xp
                });
            }
        }
    );
});

// Update user stats
app.post('/api/user-stats', authenticateToken, (req, res) => {
    const { analyses, discoveries, starsExplored, uploads, xp } = req.body;

    db.run(
        `UPDATE user_stats 
         SET analyses = ?, discoveries = ?, stars_explored = ?, uploads = ?, total_xp = ?, last_updated = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [analyses, discoveries, starsExplored, uploads, xp, req.user.userId],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to update stats' });
            }

            res.json({ message: 'Stats updated successfully' });
        }
    );
});

// Get user achievements
app.get('/api/achievements', authenticateToken, (req, res) => {
    db.all(
        'SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?',
        [req.user.userId],
        (err, achievements) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({ achievements: achievements || [] });
        }
    );
});

// Unlock achievement
app.post('/api/achievements', authenticateToken, (req, res) => {
    const { achievementId } = req.body;

    if (!achievementId) {
        return res.status(400).json({ error: 'Achievement ID is required' });
    }

    // Check if achievement already exists
    db.get(
        'SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
        [req.user.userId, achievementId],
        (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(409).json({ error: 'Achievement already unlocked' });
            }

            // Insert new achievement
            db.run(
                'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                [req.user.userId, achievementId],
                function(err) {
                    if (err) {
                        console.error('Error unlocking achievement:', err);
                        return res.status(500).json({ error: 'Failed to unlock achievement' });
                    }

                    res.json({ 
                        message: 'Achievement unlocked successfully',
                        achievementId: achievementId
                    });
                }
            );
        }
    );
});

// Verify token endpoint
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.json({ 
        valid: true, 
        user: {
            id: req.user.userId,
            username: req.user.username,
            email: req.user.email
        }
    });
});

// Serve the main application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ExoAI Explorer Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});

module.exports = app;
