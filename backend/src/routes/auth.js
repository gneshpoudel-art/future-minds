const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db/client');
const { loginLimiter } = require('../middleware/rateLimiter');
const { authMiddleware } = require('../middleware/auth');
const crypto = require('crypto');

router.post('/login', loginLimiter, [
    body('username').trim().isLength({ min: 2, max: 50 }).escape(),
    body('password').isLength({ min: 6, max: 100 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid credentials' });

    const { username, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    // Check brute-force (max 10 attempts in 15 min)
    const windowStart = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const attempts = await db.get(
        'SELECT COUNT(*) as cnt FROM login_attempts WHERE ip_hash = ? AND attempted_at > ?',
        [ipHash, windowStart]
    );
    if (attempts && attempts.cnt >= 10) {
        return res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes.' });
    }

    // Log attempt
    await db.run('INSERT INTO login_attempts (ip_hash) VALUES (?)', [ipHash]);

    const admin = await db.get('SELECT * FROM admins WHERE username = ?', [username]);
    if (!admin) return res.status(401).json({ error: 'Invalid username or password' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

    const token = jwt.sign(
        { id: admin.id, username: admin.username, fullName: admin.full_name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, admin: { id: admin.id, username: admin.username, fullName: admin.full_name } });
});

router.get('/verify', authMiddleware, (req, res) => {
    res.json({ valid: true, admin: req.admin });
});

router.post('/logout', authMiddleware, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

router.put('/change-password', authMiddleware, [
    body('currentPassword').isLength({ min: 6 }),
    body('newPassword').isLength({ min: 8 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input' });

    const admin = await db.get('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    const valid = await bcrypt.compare(req.body.currentPassword, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hash = await bcrypt.hash(req.body.newPassword, 12);
    await db.run('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, req.admin.id]);
    res.json({ message: 'Password updated successfully' });
});

module.exports = router;
