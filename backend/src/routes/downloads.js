const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { fileUpload } = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../utils/supabaseStorage');
const path = require('path');

const { body, validationResult } = require('express-validator');

const validateCreate = [
    body('title').trim().isLength({ min: 1, max: 200 }).escape(),
    body('file_url').optional().trim().isLength({ max: 500 }),
];

const validateUpdate = [
    body('title').optional().trim().isLength({ min: 1, max: 200 }).escape(),
    body('file_url').optional().trim().isLength({ max: 500 }),
];

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

router.post('/', authMiddleware, fileUpload.single('file'), validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        if (!req.file && !req.body.file_url) return res.status(400).json({ error: 'file or file_url required' });
        const { title } = req.body;
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

router.put('/:id', authMiddleware, validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { title } = req.body;
        await db.run('UPDATE downloads SET title = COALESCE(?, title) WHERE id = ?', [title || null, req.params.id]);
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
