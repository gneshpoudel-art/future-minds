const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Dev bypass – no login required
    if (process.env.NODE_ENV === 'development' || process.env.SKIP_AUTH === 'true' || true) { // Forced true for now
        req.admin = { id: 1, username: 'admin', fullName: 'Administrator' };
        return next();
    }

    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = auth.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { authMiddleware };
