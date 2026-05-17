require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('./config/passport.config');
const corsOptions = require('./config/cors.config');
const sessionConfig = require('./config/session.config');
const errorHandler = require('./middleware/error.middleware');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth.routes');
const teamRoutes = require('./routes/team.routes');
const taskRoutes = require('./routes/task.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for secure cookies on Render (required for sameSite: 'none')
app.set('trust proxy', 1);

// 1. Body parsing
app.use(express.json());

// 2. CORS (must be before session)
app.use(cors(corsOptions));

// 3. Session
app.use(session(sessionConfig));

// 4. Passport
app.use(passport.initialize());
app.use(passport.session());

// 5. Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'TeamSync API is running' });
});

// 6. Routes
app.use('/auth', authRoutes);
app.use('/teams', teamRoutes);
app.use('/tasks', taskRoutes);
app.use('/notifications', notificationRoutes);

// 7. Global error handler (MUST be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`TeamSync backend running on port ${PORT}`);
});

module.exports = app;
