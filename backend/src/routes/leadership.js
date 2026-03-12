const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../utils/supabaseStorage');

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM leadership_messages ORDER BY display_order ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch leadership' }); }
});

router.post('/', authMiddleware, imageUpload.single('photo'), async (req, res) => {
    try {
        const { name, position, message, display_order } = req.body;
        if (!name || !message) return res.status(400).json({ error: 'name and message are required' });
        const photo_url = req.file
            ? await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images')
            : null;
        const result = await db.run(
            'INSERT INTO leadership_messages (name, position, message, photo_url, display_order) VALUES (?,?,?,?,?)',
            [name, position || '', message, photo_url, parseInt(display_order) || 0]
        );
        res.status(201).json(await db.get('SELECT * FROM leadership_messages WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create leadership message' }); }
});

router.put('/:id', authMiddleware, imageUpload.single('photo'), async (req, res) => {
    try {
        const { name, position, message, display_order } = req.body;
        let photo_url = null;
        if (req.file) {
            const old = await db.get('SELECT photo_url FROM leadership_messages WHERE id = ?', [req.params.id]);
            if (old?.photo_url) await deleteFromSupabase(old.photo_url);
            photo_url = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images');
        }
        await db.run(
            'UPDATE leadership_messages SET name=COALESCE(?,name), position=COALESCE(?,position), message=COALESCE(?,message), photo_url=COALESCE(?,photo_url), display_order=COALESCE(?,display_order) WHERE id=?',
            [name || null, position || null, message || null, photo_url, display_order ? parseInt(display_order) : null, req.params.id]
        );
        res.json(await db.get('SELECT * FROM leadership_messages WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update leadership message' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const old = await db.get('SELECT photo_url FROM leadership_messages WHERE id = ?', [req.params.id]);
        if (old?.photo_url) await deleteFromSupabase(old.photo_url);
        await db.run('DELETE FROM leadership_messages WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
