const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../utils/supabaseStorage');

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM events ORDER BY event_date DESC, created_at DESC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch events' }); }
});

const { body, validationResult } = require('express-validator');

const validateCreate = [
    body('title').trim().isLength({ min: 1, max: 200 }).escape(),
    body('description').optional().trim().isLength({ max: 5000 }).escape(),
    body('event_date').optional().trim().isLength({ max: 100 }).escape(),
    body('location').optional().trim().isLength({ max: 200 }).escape(),
];

const validateUpdate = [
    body('title').optional().trim().isLength({ min: 1, max: 200 }).escape(),
    body('description').optional().trim().isLength({ max: 5000 }).escape(),
    body('event_date').optional().trim().isLength({ max: 100 }).escape(),
    body('location').optional().trim().isLength({ max: 200 }).escape(),
];

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM events ORDER BY event_date DESC, created_at DESC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch events' }); }
});

router.post('/', authMiddleware, imageUpload.single('image'), validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { title, description, event_date, location } = req.body;
        const image_url = req.file
            ? await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images')
            : null;
        const result = await db.run(
            'INSERT INTO events (title, description, event_date, location, image_url) VALUES (?,?,?,?,?)',
            [title, description || '', event_date || '', location || '', image_url]
        );
        res.status(201).json(await db.get('SELECT * FROM events WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create event' }); }
});

router.put('/:id', authMiddleware, imageUpload.single('image'), validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { title, description, event_date, location } = req.body;
        let image_url = null;
        if (req.file) {
            const old = await db.get('SELECT image_url FROM events WHERE id = ?', [req.params.id]);
            if (old?.image_url) await deleteFromSupabase(old.image_url);
            image_url = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images');
        }
        await db.run(
            'UPDATE events SET title=COALESCE(?,title), description=COALESCE(?,description), event_date=COALESCE(?,event_date), location=COALESCE(?,location), image_url=COALESCE(?,image_url) WHERE id=?',
            [title || null, description || null, event_date || null, location || null, image_url, req.params.id]
        );
        res.json(await db.get('SELECT * FROM events WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update event' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const old = await db.get('SELECT image_url FROM events WHERE id = ?', [req.params.id]);
        if (old?.image_url) await deleteFromSupabase(old.image_url);
        await db.run('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete event' }); }
});

module.exports = router;
