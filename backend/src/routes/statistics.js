const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Public: get all statistics
router.get('/', async (req, res) => {
    try {
        const stats = await db.all('SELECT * FROM statistics ORDER BY display_order ASC');
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Admin: create a new statistic
router.post('/', authMiddleware, [
    body('label').trim().isLength({ min: 1, max: 100 }).escape(),
    body('value').trim().isLength({ min: 1, max: 20 }).escape(),
    body('suffix').optional().trim().isLength({ max: 10 }).escape(),
    body('icon').optional().trim().isLength({ max: 50 }).escape(),
    body('display_order').optional().isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { label, value, suffix, icon, display_order } = req.body;
        const result = await db.run(
            'INSERT INTO statistics (label, value, suffix, icon, display_order) VALUES (?,?,?,?,?)',
            [label, value, suffix || '+', icon || 'Users', display_order || 0]
        );
        const stat = await db.get('SELECT * FROM statistics WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json(stat);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create statistic' });
    }
});

// Admin: update a statistic
router.put('/:id', authMiddleware, [
    body('label').optional().trim().isLength({ max: 100 }).escape(),
    body('value').optional().trim().isLength({ max: 20 }).escape(),
    body('suffix').optional().trim().isLength({ max: 10 }).escape(),
    body('icon').optional().trim().isLength({ max: 50 }).escape(),
    body('display_order').optional().isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { label, value, suffix, icon, display_order } = req.body;
        await db.run(
            'UPDATE statistics SET label=COALESCE(?,label), value=COALESCE(?,value), suffix=COALESCE(?,suffix), icon=COALESCE(?,icon), display_order=COALESCE(?,display_order), updated_at=CURRENT_TIMESTAMP WHERE id=?',
            [label || null, value || null, suffix || null, icon || null, display_order ?? null, req.params.id]
        );
        const stat = await db.get('SELECT * FROM statistics WHERE id = ?', [req.params.id]);
        res.json(stat);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update statistic' });
    }
});

// Admin: delete a statistic
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM statistics WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete statistic' });
    }
});

module.exports = router;
