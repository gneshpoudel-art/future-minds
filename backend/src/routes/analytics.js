const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { analyticsLimiter } = require('../middleware/rateLimiter');
const crypto = require('crypto');

// Public: track page view
router.post('/track', analyticsLimiter, async (req, res) => {
    try {
        const { session_id, page_url, page_title, referrer, time_spent, scroll_depth, event_type } = req.body;
        if (!session_id || !page_url) return res.status(400).json({ error: 'session_id and page_url required' });

        const ip = req.ip || req.connection.remoteAddress;
        const ip_hash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 20);
        const ua = req.headers['user-agent'] || '';

        if (event_type === 'session_start') {
            // Upsert visitor
            const existing = await db.get('SELECT id, visit_count FROM visitors WHERE session_id = ?', [session_id]);
            if (existing) {
                await db.run('UPDATE visitors SET last_visit = CURRENT_TIMESTAMP, visit_count = visit_count + 1 WHERE session_id = ?', [session_id]);
            } else {
                await db.run(
                    'INSERT INTO visitors (session_id, ip_hash, user_agent) VALUES (?,?,?)',
                    [session_id, ip_hash, ua.substring(0, 500)]
                );
            }
            // Upsert session
            const sessExisting = await db.get('SELECT id FROM sessions WHERE session_id = ?', [session_id]);
            if (!sessExisting) {
                const isReturning = existing ? 1 : 0;
                await db.run('INSERT INTO sessions (session_id, is_returning) VALUES (?,?)', [session_id, isReturning]);
            }
        } else if (event_type === 'session_end') {
            // Update session end time & duration
            const ts = parseInt(time_spent) || 0;
            await db.run(
                'UPDATE sessions SET end_time = CURRENT_TIMESTAMP, time_spent = ?, pages_visited = (SELECT COUNT(*) FROM page_views WHERE session_id = ?) WHERE session_id = ?',
                [ts, session_id, session_id]
            );
            await db.run('UPDATE visitors SET total_time_spent = total_time_spent + ? WHERE session_id = ?', [ts, session_id]);
        } else {
            // Track page view
            await db.run(
                'INSERT INTO page_views (session_id, page_url, page_title, referrer, time_spent, scroll_depth) VALUES (?,?,?,?,?,?)',
                [session_id, page_url.substring(0, 500), (page_title || '').substring(0, 200), (referrer || '').substring(0, 500), parseInt(time_spent) || 0, parseInt(scroll_depth) || 0]
            );
        }

        res.status(200).json({ ok: true });
    } catch (err) {
        // Silently fail analytics – don't disrupt the user experience
        res.status(200).json({ ok: true });
    }
});

// Admin: overview stats
router.get('/overview', authMiddleware, async (req, res) => {
    try {
        const totalVisitors = await db.get('SELECT COUNT(*) as cnt FROM visitors');
        const returningVisitors = await db.get("SELECT COUNT(*) as cnt FROM visitors WHERE visit_count > 1");
        const totalPageViews = await db.get('SELECT COUNT(*) as cnt FROM page_views');
        const avgSession = await db.get('SELECT AVG(time_spent) as avg FROM sessions WHERE time_spent > 0');
        const avgPages = await db.get('SELECT AVG(pages_visited) as avg FROM sessions WHERE pages_visited > 0');
        const pendingTestimonials = await db.get("SELECT COUNT(*) as cnt FROM testimonials WHERE status='pending'");
        const contactSubmissions = await db.get('SELECT COUNT(*) as cnt FROM contact_submissions');

        res.json({
            totalVisitors: totalVisitors?.cnt || 0,
            uniqueVisitors: totalVisitors?.cnt || 0,
            returningVisitors: returningVisitors?.cnt || 0,
            totalPageViews: totalPageViews?.cnt || 0,
            avgSessionTime: Math.round(avgSession?.avg || 0),
            avgPagesPerSession: parseFloat((avgPages?.avg || 0).toFixed(1)),
            pendingTestimonials: pendingTestimonials?.cnt || 0,
            contactSubmissions: contactSubmissions?.cnt || 0,
        });
    } catch (err) { res.status(500).json({ error: 'Failed to fetch analytics' }); }
});

// Admin: daily visitors (last 30 days)
router.get('/daily', authMiddleware, async (req, res) => {
    try {
        const rows = await db.all(`
      SELECT DATE(first_visit) as date, COUNT(*) as visitors
      FROM visitors
      WHERE first_visit >= DATE('now', '-30 days')
      GROUP BY DATE(first_visit)
      ORDER BY date ASC
    `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch daily analytics' }); }
});

// Admin: most visited pages (top 10)
router.get('/pages', authMiddleware, async (req, res) => {
    try {
        const rows = await db.all(`
      SELECT page_url, page_title, COUNT(*) as views, AVG(time_spent) as avg_time
      FROM page_views
      WHERE timestamp >= DATE('now', '-30 days')
      GROUP BY page_url
      ORDER BY views DESC
      LIMIT 10
    `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch page analytics' }); }
});

// Admin: hourly activity (today)
router.get('/hourly', authMiddleware, async (req, res) => {
    try {
        const rows = await db.all(`
      SELECT strftime('%H', timestamp) as hour, COUNT(*) as views
      FROM page_views
      WHERE DATE(timestamp) = DATE('now')
      GROUP BY hour
      ORDER BY hour ASC
    `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch hourly analytics' }); }
});

module.exports = router;
