const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const validateCreate = [
    body('branch_name').trim().isLength({ min: 1, max: 200 }).escape(),
    body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('address').optional().trim().isLength({ max: 500 }).escape(),
    body('phone').optional().trim().isLength({ max: 100 }).escape(),
    body('map_link').optional().trim().isLength({ max: 500 }),
    body('display_order').optional().isInt(),
];
const validateUpdate = [
    body('branch_name').optional().trim().isLength({ min: 1, max: 200 }).escape(),
    body('email').optional().trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('address').optional().trim().isLength({ max: 500 }).escape(),
    body('phone').optional().trim().isLength({ max: 100 }).escape(),
    body('map_link').optional().trim().isLength({ max: 500 }),
    body('display_order').optional().isInt(),
];

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM branches ORDER BY display_order ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch branches' }); }
});

router.post('/', authMiddleware, validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { branch_name, email, address, phone, map_link, display_order } = req.body;
        const result = await db.run(
            'INSERT INTO branches (branch_name, email, address, phone, map_link, display_order) VALUES (?,?,?,?,?,?)',
            [branch_name, email, address || '', phone || '', map_link || '', parseInt(display_order) || 0]
        );
        const item = await db.get('SELECT * FROM branches WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json(item);
    } catch (err) {
        console.error('[Branches] Create error:', err);
        res.status(500).json({ error: 'Failed to create branch' });
    }
});

router.put('/:id', authMiddleware, validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { branch_name, email, address, phone, map_link, display_order } = req.body;
        await db.run(
            'UPDATE branches SET branch_name=COALESCE(?,branch_name), email=COALESCE(?,email), address=COALESCE(?,address), phone=COALESCE(?,phone), map_link=COALESCE(?,map_link), display_order=COALESCE(?,display_order) WHERE id=?',
            [branch_name || null, email || null, address || null, phone || null, map_link || null, display_order ? parseInt(display_order) : null, req.params.id]
        );
        const item = await db.get('SELECT * FROM branches WHERE id = ?', [req.params.id]);
        res.json(item);
    } catch (err) { res.status(500).json({ error: 'Failed to update branch' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM branches WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete branch' }); }
});

module.exports = router;
