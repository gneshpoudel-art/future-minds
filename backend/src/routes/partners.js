const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload, getFileUrl } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM partners ORDER BY display_order ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch partners' }); }
});

router.post('/', authMiddleware, imageUpload.single('logo'), async (req, res) => {
    try {
        const { university_name, website_link, display_order } = req.body;
        if (!university_name) return res.status(400).json({ error: 'university_name is required' });
        const logo_url = req.file ? getFileUrl(req, req.file.filename, 'images') : null;
        const result = await db.run(
            'INSERT INTO partners (university_name, logo_url, website_link, display_order) VALUES (?,?,?,?)',
            [university_name, logo_url, website_link || '', parseInt(display_order) || 0]
        );
        const item = await db.get('SELECT * FROM partners WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json(item);
    } catch (err) { res.status(500).json({ error: 'Failed to create partner' }); }
});

router.put('/:id', authMiddleware, imageUpload.single('logo'), async (req, res) => {
    try {
        const { university_name, website_link, display_order } = req.body;
        let logo_url = null;
        if (req.file) {
            logo_url = getFileUrl(req, req.file.filename, 'images');
            // Delete old logo
            const old = await db.get('SELECT logo_url FROM partners WHERE id = ?', [req.params.id]);
            if (old && old.logo_url && old.logo_url.includes('/uploads/')) {
                const oldFile = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads', 'images', path.basename(old.logo_url));
                if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
            }
        }
        await db.run(
            'UPDATE partners SET university_name=COALESCE(?,university_name), logo_url=COALESCE(?,logo_url), website_link=COALESCE(?,website_link), display_order=COALESCE(?,display_order) WHERE id=?',
            [university_name || null, logo_url, website_link || null, display_order ? parseInt(display_order) : null, req.params.id]
        );
        const item = await db.get('SELECT * FROM partners WHERE id = ?', [req.params.id]);
        res.json(item);
    } catch (err) { res.status(500).json({ error: 'Failed to update partner' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const partner = await db.get('SELECT logo_url FROM partners WHERE id = ?', [req.params.id]);
        if (partner && partner.logo_url && partner.logo_url.includes('/uploads/')) {
            const file = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads', 'images', path.basename(partner.logo_url));
            if (fs.existsSync(file)) fs.unlinkSync(file);
        }
        await db.run('DELETE FROM partners WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete partner' }); }
});

module.exports = router;
