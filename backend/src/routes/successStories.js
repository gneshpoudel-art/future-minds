const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../utils/supabaseStorage');
const { body, validationResult } = require('express-validator');

const validateCreate = [
    body('student_name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('story_text').trim().isLength({ min: 1, max: 5000 }).escape(),
    body('country').optional().trim().isLength({ max: 100 }).escape(),
    body('university').optional().trim().isLength({ max: 200 }).escape(),
    body('display_order').optional().isInt(),
];

const validateUpdate = [
    body('student_name').optional().trim().isLength({ min: 1, max: 100 }).escape(),
    body('story_text').optional().trim().isLength({ min: 1, max: 5000 }).escape(),
    body('country').optional().trim().isLength({ max: 100 }).escape(),
    body('university').optional().trim().isLength({ max: 200 }).escape(),
    body('display_order').optional().isInt(),
];

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM success_stories ORDER BY display_order ASC, created_at DESC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch success stories' }); }
});

router.post('/', authMiddleware, imageUpload.single('image'), validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { student_name, story_text, country, university, display_order } = req.body;
        const image_url = req.file
            ? await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images')
            : null;
        const result = await db.run(
            'INSERT INTO success_stories (student_name, story_text, image_url, country, university, display_order) VALUES (?,?,?,?,?,?)',
            [student_name, story_text, image_url, country || '', university || '', parseInt(display_order) || 0]
        );
        res.status(201).json(await db.get('SELECT * FROM success_stories WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create success story' }); }
});

router.put('/:id', authMiddleware, imageUpload.single('image'), validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { student_name, story_text, country, university, display_order } = req.body;
        let image_url = null;
        if (req.file) {
            const old = await db.get('SELECT image_url FROM success_stories WHERE id = ?', [req.params.id]);
            if (old?.image_url) await deleteFromSupabase(old.image_url);
            image_url = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images');
        }
        await db.run(
            'UPDATE success_stories SET student_name=COALESCE(?,student_name), story_text=COALESCE(?,story_text), image_url=COALESCE(?,image_url), country=COALESCE(?,country), university=COALESCE(?,university), display_order=COALESCE(?,display_order) WHERE id=?',
            [student_name || null, story_text || null, image_url, country || null, university || null, display_order ? parseInt(display_order) : null, req.params.id]
        );
        res.status(200).json(await db.get('SELECT * FROM success_stories WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update success story' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const old = await db.get('SELECT image_url FROM success_stories WHERE id = ?', [req.params.id]);
        if (old?.image_url) await deleteFromSupabase(old.image_url);
        await db.run('DELETE FROM success_stories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
