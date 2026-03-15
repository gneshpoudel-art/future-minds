require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "fonts.googleapis.com", "translate.google.com", "translate.googleapis.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
            fontSrc: ["'self'", "fonts.gstatic.com", "data:"],
            connectSrc: ["'self'", "https:", "http://localhost:4000", "http://localhost:8080"],
        },
    },
}));

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8080').split(',').map(o => o.trim());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Rate limiting
app.use('/api', generalLimiter);

// Static file serving for uploads
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
app.use('/uploads', express.static(uploadDir));

// Serve analytics tracking script
app.use('/analytics.js', express.static(path.join(__dirname, '..', 'public', 'analytics.js')));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/why-choose-us', require('./routes/whyChooseUs'));
app.use('/api/services', require('./routes/services'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/leadership', require('./routes/leadership'));
app.use('/api/success-stories', require('./routes/successStories'));
app.use('/api/study-abroad', require('./routes/studyAbroad'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/downloads', require('./routes/downloads'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/events', require('./routes/events'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
    res.json({ message: 'Future Minds API', admin: '/admin', health: '/api/health' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    if (err.name === 'MulterError') {
        return res.status(400).json({ error: err.message });
    }
    if (err.message && err.message.includes('Invalid')) {
        return res.status(400).json({ error: err.message });
    }
    console.error('[Error]', err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
