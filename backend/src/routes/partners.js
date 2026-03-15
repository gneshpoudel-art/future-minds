const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../utils/supabaseStorage');
const { body, validationResult } = require('express-validator');

const validateCreate = [
    body('university_name').trim().isLength({ min: 1, max: 200 }).escape(),
    body('website_link').optional().trim().isLength({ max: 500 }),
    body('display_order').optional().isInt(),
];

const validateUpdate = [
    body('university_name').optional().trim().isLength({ min: 1, max: 200 }).escape(),
    body('website_link').optional().trim().isLength({ max: 500 }),
    body('display_order').optional().isInt(),
];

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM partners ORDER BY display_order ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch partners' }); }
});

router.post('/', authMiddleware, imageUpload.single('logo'), validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { university_name, website_link, display_order } = req.body;
        const logo_url = req.file
            ? await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images')
            : null;
        const result = await db.run(
            'INSERT INTO partners (university_name, logo_url, website_link, display_order) VALUES (?,?,?,?)',
            [university_name, logo_url, website_link || '', parseInt(display_order) || 0]
        );
        res.status(201).json(await db.get('SELECT * FROM partners WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create partner' }); }
});

router.put('/:id', authMiddleware, imageUpload.single('logo'), validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { university_name, website_link, display_order } = req.body;
        let logo_url = null;
        if (req.file) {
            const old = await db.get('SELECT logo_url FROM partners WHERE id = ?', [req.params.id]);
            if (old?.logo_url) await deleteFromSupabase(old.logo_url);
            logo_url = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images');
        }
        await db.run(
            'UPDATE partners SET university_name=COALESCE(?,university_name), logo_url=COALESCE(?,logo_url), website_link=COALESCE(?,website_link), display_order=COALESCE(?,display_order) WHERE id=?',
            [university_name || null, logo_url, website_link || null, display_order ? parseInt(display_order) : null, req.params.id]
        );
        res.json(await db.get('SELECT * FROM partners WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update partner' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const partner = await db.get('SELECT logo_url FROM partners WHERE id = ?', [req.params.id]);
        if (partner?.logo_url) await deleteFromSupabase(partner.logo_url);
        await db.run('DELETE FROM partners WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete partner' }); }
});

module.exports = router;
