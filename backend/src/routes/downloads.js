const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { fileUpload } = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../utils/supabaseStorage');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT id, title, file_url, file_type, download_count, created_at FROM downloads ORDER BY created_at DESC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch downloads' }); }
});

router.post('/download/:id', async (req, res) => {
    try {
        await db.run('UPDATE downloads SET download_count = download_count + 1 WHERE id = ?', [req.params.id]);
        const item = await db.get('SELECT file_url FROM downloads WHERE id = ?', [req.params.id]);
        if (!item) return res.status(404).json({ error: 'File not found' });
        res.json({ file_url: item.file_url });
    } catch (err) { res.status(500).json({ error: 'Failed to record download' }); }
});

router.post('/', authMiddleware, fileUpload.single('file'), async (req, res) => {
    try {
        if (!req.file && !req.body.file_url) return res.status(400).json({ error: 'file or file_url required' });
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: 'title required' });
        let file_url = req.body.file_url || null;
        let file_type = 'link';
        let file_size = null;
        if (req.file) {
            file_url = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'files');
            file_type = path.extname(req.file.originalname).replace('.', '');
            file_size = req.file.size;
        }
        const result = await db.run(
            'INSERT INTO downloads (title, file_url, file_type, file_size) VALUES (?,?,?,?)',
            [title, file_url, file_type, file_size]
        );
        res.status(201).json(await db.get('SELECT * FROM downloads WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to upload file' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title } = req.body;
        await db.run('UPDATE downloads SET title = ? WHERE id = ?', [title, req.params.id]);
        res.json(await db.get('SELECT * FROM downloads WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const item = await db.get('SELECT file_url FROM downloads WHERE id = ?', [req.params.id]);
        if (item?.file_url) await deleteFromSupabase(item.file_url);
        await db.run('DELETE FROM downloads WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
