const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload, getFileUrl } = require('../middleware/upload');

// Universities
router.get('/universities', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM study_abroad_universities ORDER BY country ASC, display_order ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch' }); }
});

router.post('/universities', authMiddleware, imageUpload.single('logo'), async (req, res) => {
    try {
        const { name, country, website_link, display_order } = req.body;
        if (!name || !country) return res.status(400).json({ error: 'name and country required' });
        const logo_url = req.file ? getFileUrl(req, req.file.filename, 'images') : null;
        const result = await db.run(
            'INSERT INTO study_abroad_universities (name, country, logo_url, website_link, display_order) VALUES (?,?,?,?,?)',
            [name, country, logo_url, website_link || '', parseInt(display_order) || 0]
        );
        res.status(201).json(await db.get('SELECT * FROM study_abroad_universities WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create' }); }
});

router.delete('/universities/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM study_abroad_universities WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

// Admission requirements
router.get('/requirements', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM admission_requirements ORDER BY country ASC, display_order ASC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch' }); }
});

router.post('/requirements', authMiddleware, async (req, res) => {
    try {
        const { country, requirement, description, display_order } = req.body;
        if (!country || !requirement) return res.status(400).json({ error: 'country and requirement required' });
        const result = await db.run(
            'INSERT INTO admission_requirements (country, requirement, description, display_order) VALUES (?,?,?,?)',
            [country, requirement, description || '', parseInt(display_order) || 0]
        );
        res.status(201).json(await db.get('SELECT * FROM admission_requirements WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create' }); }
});

router.put('/requirements/:id', authMiddleware, async (req, res) => {
    try {
        const { country, requirement, description, display_order } = req.body;
        await db.run(
            'UPDATE admission_requirements SET country=COALESCE(?,country), requirement=COALESCE(?,requirement), description=COALESCE(?,description), display_order=COALESCE(?,display_order) WHERE id=?',
            [country || null, requirement || null, description || null, display_order ? parseInt(display_order) : null, req.params.id]
        );
        res.json(await db.get('SELECT * FROM admission_requirements WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update' }); }
});

router.delete('/requirements/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM admission_requirements WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

// Scholarships
router.get('/scholarships', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM scholarships ORDER BY created_at DESC');
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch' }); }
});

router.post('/scholarships', authMiddleware, async (req, res) => {
    try {
        const { name, country, description, amount, deadline, link } = req.body;
        if (!name) return res.status(400).json({ error: 'name required' });
        const result = await db.run(
            'INSERT INTO scholarships (name, country, description, amount, deadline, link) VALUES (?,?,?,?,?,?)',
            [name, country || '', description || '', amount || '', deadline || '', link || '']
        );
        res.status(201).json(await db.get('SELECT * FROM scholarships WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) { res.status(500).json({ error: 'Failed to create' }); }
});

router.put('/scholarships/:id', authMiddleware, async (req, res) => {
    try {
        const { name, country, description, amount, deadline, link } = req.body;
        await db.run(
            'UPDATE scholarships SET name=COALESCE(?,name), country=COALESCE(?,country), description=COALESCE(?,description), amount=COALESCE(?,amount), deadline=COALESCE(?,deadline), link=COALESCE(?,link) WHERE id=?',
            [name || null, country || null, description || null, amount || null, deadline || null, link || null, req.params.id]
        );
        res.json(await db.get('SELECT * FROM scholarships WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update' }); }
});

router.delete('/scholarships/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM scholarships WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
