const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Connect Database
connectDB();

// Security Headers
// contentSecurityPolicy is disabled because Helmet's default CSP blocks React's
// inline <script> tags in the production build (create-react-app injects them).
// All other Helmet protections remain active: X-Frame-Options, HSTS, nosniff, etc.
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Init Middleware
app.use(express.json());
app.use(mongoSanitize());
app.use('/uploads', express.static('uploads'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/upload', require('./routes/api/upload'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
