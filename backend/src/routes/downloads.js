const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { fileUpload, getFileUrl } = require('../middleware/upload');
const fs = require('fs');
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
        const file_url = req.file ? getFileUrl(req, req.file.filename, 'files') : req.body.file_url;
        const file_type = req.file ? path.extname(req.file.originalname).replace('.', '') : 'link';
        const file_size = req.file ? req.file.size : null;
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
        if (item && item.file_url && item.file_url.includes('/uploads/')) {
            const file = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads', 'files', path.basename(item.file_url));
            if (fs.existsSync(file)) fs.unlinkSync(file);
        }
        await db.run('DELETE FROM downloads WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
