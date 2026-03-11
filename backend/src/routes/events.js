const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload, getFileUrl } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM events ORDER BY event_date DESC, created_at DESC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch events' }); }
});

router.post('/', authMiddleware, imageUpload.single('image'), async (req, res) => {
    try {
        const { title, description, event_date, location } = req.body;
        if (!title) return res.status(400).json({ error: 'title required' });
        const image_url = req.file ? getFileUrl(req, req.file.filename, 'images') : null;
        const result = await db.run(
            'INSERT INTO events (title, description, event_date, location, image_url) VALUES (?,?,?,?,?)',
            [title, description || '', event_date || '', location || '', image_url]
        );
        res.status(201).json(await db.get('SELECT * FROM events WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create event' }); }
});

router.put('/:id', authMiddleware, imageUpload.single('image'), async (req, res) => {
    try {
        const { title, description, event_date, location } = req.body;
        let image_url = null;
        if (req.file) {
            image_url = getFileUrl(req, req.file.filename, 'images');
            const old = await db.get('SELECT image_url FROM events WHERE id = ?', [req.params.id]);
            if (old && old.image_url && old.image_url.includes('/uploads/')) {
                const file = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads', 'images', path.basename(old.image_url));
                if (fs.existsSync(file)) fs.unlinkSync(file);
            }
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
        if (old && old.image_url && old.image_url.includes('/uploads/')) {
            const file = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads', 'images', path.basename(old.image_url));
            if (fs.existsSync(file)) fs.unlinkSync(file);
        }
        await db.run('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete event' }); }
});

module.exports = router;
