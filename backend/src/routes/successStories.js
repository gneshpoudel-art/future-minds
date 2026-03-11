const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload, getFileUrl } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM success_stories ORDER BY display_order ASC, created_at DESC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch success stories' }); }
});

router.post('/', authMiddleware, imageUpload.single('image'), async (req, res) => {
    try {
        const { student_name, story_text, country, university, display_order } = req.body;
        if (!student_name || !story_text) return res.status(400).json({ error: 'student_name and story_text required' });
        const image_url = req.file ? getFileUrl(req, req.file.filename, 'images') : null;
        const result = await db.run(
            'INSERT INTO success_stories (student_name, story_text, image_url, country, university, display_order) VALUES (?,?,?,?,?,?)',
            [student_name, story_text, image_url, country || '', university || '', parseInt(display_order) || 0]
        );
        const item = await db.get('SELECT * FROM success_stories WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json(item);
    } catch (err) { res.status(500).json({ error: 'Failed to create success story' }); }
});

router.put('/:id', authMiddleware, imageUpload.single('image'), async (req, res) => {
    try {
        const { student_name, story_text, country, university, display_order } = req.body;
        let image_url = null;
        if (req.file) {
            image_url = getFileUrl(req, req.file.filename, 'images');
            const old = await db.get('SELECT image_url FROM success_stories WHERE id = ?', [req.params.id]);
            if (old && old.image_url && old.image_url.includes('/uploads/')) {
                const file = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads', 'images', path.basename(old.image_url));
                if (fs.existsSync(file)) fs.unlinkSync(file);
            }
        }
        await db.run(
            'UPDATE success_stories SET student_name=COALESCE(?,student_name), story_text=COALESCE(?,story_text), image_url=COALESCE(?,image_url), country=COALESCE(?,country), university=COALESCE(?,university), display_order=COALESCE(?,display_order) WHERE id=?',
            [student_name || null, story_text || null, image_url, country || null, university || null, display_order ? parseInt(display_order) : null, req.params.id]
        );
        const item = await db.get('SELECT * FROM success_stories WHERE id = ?', [req.params.id]);
        res.json(item);
    } catch (err) { res.status(500).json({ error: 'Failed to update success story' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const old = await db.get('SELECT image_url FROM success_stories WHERE id = ?', [req.params.id]);
        if (old && old.image_url && old.image_url.includes('/uploads/')) {
            const file = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads', 'images', path.basename(old.image_url));
            if (fs.existsSync(file)) fs.unlinkSync(file);
        }
        await db.run('DELETE FROM success_stories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
