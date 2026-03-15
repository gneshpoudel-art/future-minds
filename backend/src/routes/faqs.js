const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM faqs ORDER BY display_order ASC, created_at ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch FAQs' }); }
});

const validateCreate = [
    body('question').trim().isLength({ min: 1, max: 500 }).escape(),
    body('answer').trim().isLength({ min: 1, max: 5000 }).escape(),
    body('display_order').optional().isInt(),
];

const validateUpdate = [
    body('question').optional().trim().isLength({ min: 1, max: 500 }).escape(),
    body('answer').optional().trim().isLength({ min: 1, max: 5000 }).escape(),
    body('display_order').optional().isInt(),
];

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM faqs ORDER BY display_order ASC, created_at ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch FAQs' }); }
});

router.post('/', authMiddleware, validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { question, answer, display_order } = req.body;
        const result = await db.run(
            'INSERT INTO faqs (question, answer, display_order) VALUES (?,?,?)',
            [question, answer, parseInt(display_order) || 0]
        );
        res.status(201).json(await db.get('SELECT * FROM faqs WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create FAQ' }); }
});

router.put('/:id', authMiddleware, validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { question, answer, display_order } = req.body;
        await db.run(
            'UPDATE faqs SET question=COALESCE(?,question), answer=COALESCE(?,answer), display_order=COALESCE(?,display_order) WHERE id=?',
            [question || null, answer || null, display_order ? parseInt(display_order) : null, req.params.id]
        );
        res.json(await db.get('SELECT * FROM faqs WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update FAQ' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM faqs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete FAQ' }); }
});

module.exports = router;
