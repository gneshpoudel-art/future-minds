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

// Admin: update a statistic
router.put('/:id', authMiddleware, [
    body('label').optional().trim().isLength({ max: 100 }).escape(),
    body('value').optional().trim().isLength({ max: 20 }).escape(),
    body('suffix').optional().trim().isLength({ max: 10 }).escape(),
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

module.exports = router;
