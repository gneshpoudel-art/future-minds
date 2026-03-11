const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

const analyticsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: 'Too many analytics requests.' },
    standardHeaders: false,
    legacyHeaders: false,
});

module.exports = { generalLimiter, loginLimiter, analyticsLimiter };
