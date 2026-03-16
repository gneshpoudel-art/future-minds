require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.path}`);
    next();
});

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
            connectSrc: ["'self'", "https:", "http://localhost:*", "ws:", "wss:"],
        },
    },
}));

// CORS - handle production and development domains
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8080,http://localhost:4000').split(',').map(o => o.trim());
console.log('[CORS] Allowed origins:', allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin requests (no Origin header)
        if (!origin) return callback(null, true);

        // Allow if in whitelist or if whitelist contains '*'
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }

        // Also allow same-origin if requested from same host (resilient for production)
        try {
            const originHost = new URL(origin).host;
            // This is a bit recursive in code but logically: if we are serving our own admin panel
            // and it calls our API, it should be allowed regardless of the exact domain name.
            // However, in standard CORS, usually we rely on the whitelist.
            // For Render, we'll suggest the user adds their domain to CORS_ORIGIN.
            // But to be helpful, let's log specifically what's being rejected.
        } catch (e) { }

        console.warn('[CORS] Rejected origin:', origin);
        callback(new Error('Not allowed by CORS'));
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

// API root
app.get('/api', (req, res) => {
    res.json({ message: 'Future Minds API', admin: '/admin', health: '/api/health' });
});

// Serve frontend static files (if built)
const frontendDir = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(frontendDir, {
    maxAge: '1d',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Don't serve SPA for API or admin routes
    if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path.startsWith('/uploads') || req.path.startsWith('/analytics.js')) {
        return res.status(404).json({ error: 'Not found' });
    }

    const indexPath = path.join(frontendDir, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // Fallback if dist doesn't exist (development mode)
            res.status(404).json({ error: 'Frontend not found. Please build the frontend first.' });
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    if (err.name === 'MulterError') {
        return res.status(400).json({ error: err.message });
    }
    if (err.message && err.message.includes('Invalid')) {
        return res.status(400).json({ error: err.message });
    }
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({ error: 'CORS policy violation' });
    }
    console.error('[Error]', err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
