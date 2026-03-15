const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const validate = [
    body('title').trim().isLength({ min: 1, max: 200 }).escape(),
    body('description').optional().trim().isLength({ max: 1000 }).escape(),
    body('icon').optional().trim().isLength({ max: 50 }).escape(),
    body('slug').optional().trim().isLength({ max: 100 }).escape(),
    body('display_order').optional().isInt(),
];

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM why_choose_us ORDER BY display_order ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch items' }); }
});

router.post('/', authMiddleware, validate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { title, description, icon, slug, display_order } = req.body;
        const result = await db.run(
            'INSERT INTO why_choose_us (title, description, icon, slug, display_order) VALUES (?,?,?,?,?)',
            [title, description || '', icon || 'CheckCircle', slug || '', display_order || 0]
        );
        const item = await db.get('SELECT * FROM why_choose_us WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json(item);
    } catch (err) { console.error('[whyChooseUs POST]', err); res.status(500).json({ error: 'Failed to create item', detail: err.message }); }
});

router.put('/:id', authMiddleware, validate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { title, description, icon, slug, display_order } = req.body;
        await db.run(
            'UPDATE why_choose_us SET title=COALESCE(?,title), description=COALESCE(?,description), icon=COALESCE(?,icon), slug=COALESCE(?,slug), display_order=COALESCE(?,display_order) WHERE id=?',
            [title || null, description || null, icon || null, slug || null, display_order ?? null, req.params.id]
        );
        const item = await db.get('SELECT * FROM why_choose_us WHERE id = ?', [req.params.id]);
        res.json(item);
    } catch (err) { console.error('[whyChooseUs PUT]', err); res.status(500).json({ error: 'Failed to update item', detail: err.message }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM why_choose_us WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { console.error('[whyChooseUs DELETE]', err); res.status(500).json({ error: 'Failed to delete', detail: err.message }); }
});

module.exports = router;
