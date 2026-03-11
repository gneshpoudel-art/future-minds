const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload, getFileUrl } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM gallery ORDER BY display_order ASC, created_at ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch gallery' }); }
});

router.post('/', authMiddleware, imageUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Image file is required' });
        const { caption, comment, display_order } = req.body;
        const image_url = getFileUrl(req, req.file.filename, 'images');
        const result = await db.run(
            'INSERT INTO gallery (image_url, caption, comment, display_order) VALUES (?,?,?,?)',
            [image_url, caption || '', comment || '', parseInt(display_order) || 0]
        );
        const item = await db.get('SELECT * FROM gallery WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json(item);
    } catch (err) { res.status(500).json({ error: 'Failed to upload image' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { caption, comment, display_order } = req.body;
        await db.run(
            'UPDATE gallery SET caption=COALESCE(?,caption), comment=COALESCE(?,comment), display_order=COALESCE(?,display_order) WHERE id=?',
            [caption || null, comment || null, display_order ? parseInt(display_order) : null, req.params.id]
        );
        const item = await db.get('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
        res.json(item);
    } catch (err) { res.status(500).json({ error: 'Failed to update image' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const img = await db.get('SELECT image_url FROM gallery WHERE id = ?', [req.params.id]);
        if (img && img.image_url && img.image_url.includes('/uploads/')) {
            const file = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads', 'images', path.basename(img.image_url));
            if (fs.existsSync(file)) fs.unlinkSync(file);
        }
        await db.run('DELETE FROM gallery WHERE id = ?', [req.params.id]);
        res.json({ message: 'Image deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete image' }); }
});

module.exports = router;
