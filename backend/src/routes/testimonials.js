const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const { uploadToSupabase } = require('../utils/supabaseStorage');
const { body, validationResult } = require('express-validator');

// Public: get approved testimonials
router.get('/', async (req, res) => {
    try {
        const items = await db.all("SELECT id, name, university, message, photo_url, created_at FROM testimonials WHERE status='approved' ORDER BY created_at DESC");
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch testimonials' }); }
});

// Public: submit a testimonial
router.post('/', imageUpload.single('photo'), [
    body('name').trim().isLength({ min: 2, max: 100 }).escape(),
    body('message').trim().isLength({ min: 10, max: 2000 }).escape(),
    body('university').optional().trim().isLength({ max: 200 }).escape(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { name, university, message } = req.body;
        let photo_url = null;
        if (req.file) {
            photo_url = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images');
        }
        await db.run(
            "INSERT INTO testimonials (name, university, message, photo_url, status) VALUES (?,?,?,?,'pending')",
            [name, university || '', message, photo_url]
        );
        res.status(201).json({ id: Date.now(), message: 'Testimonial submitted successfully. It will appear after review.' });
    } catch (err) { res.status(500).json({ error: 'Failed to submit testimonial' }); }
});

// Admin: get all testimonials
router.get('/admin/all', authMiddleware, async (req, res) => {
    try {
        const { status } = req.query;
        let sql = 'SELECT * FROM testimonials';
        const args = [];
        if (status) { sql += ' WHERE status = ?'; args.push(status); }
        sql += ' ORDER BY created_at DESC';
        const items = await db.all(sql, args);
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch testimonials' }); }
});

// Admin: approve/reject
router.put('/admin/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        await db.run('UPDATE testimonials SET status = ? WHERE id = ?', [status, req.params.id]);
        const item = await db.get('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
        res.json(item);
    } catch (err) { res.status(500).json({ error: 'Failed to update testimonial' }); }
});

// Admin: delete
router.delete('/admin/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete testimonial' }); }
});

module.exports = router;
