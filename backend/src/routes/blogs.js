const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../utils/supabaseStorage');
const { body, validationResult } = require('express-validator');

function slugify(text) {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim('-');
}

// Public: published blogs
router.get('/', async (req, res) => {
    try {
        const { category, limit = 20, offset = 0 } = req.query;
        let sql = 'SELECT id, title, slug, excerpt, image_url, category, created_at FROM blogs WHERE published = 1';
        const args = [];
        if (category) { sql += ' AND category = ?'; args.push(category); }
        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        args.push(parseInt(limit), parseInt(offset));
        const blogs = await db.all(sql, args);
        res.json(blogs);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch blogs' }); }
});

// Public: single blog by slug
router.get('/:slug', async (req, res) => {
    try {
        const blog = await db.get('SELECT * FROM blogs WHERE slug = ? AND published = 1', [req.params.slug]);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch blog' }); }
});

// Admin: all blogs
router.get('/admin/all', authMiddleware, async (req, res) => {
    try {
        const blogs = await db.all('SELECT * FROM blogs ORDER BY created_at DESC');
        res.json(blogs);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch' }); }
});

// Admin: create blog
router.post('/', authMiddleware, imageUpload.single('image'), async (req, res) => {
    try {
        const { title, content, excerpt, category, published } = req.body;
        if (!title) return res.status(400).json({ error: 'title is required' });
        const slug = req.body.slug || slugify(title) + '-' + Date.now();
        const image_url = req.file
            ? await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images')
            : null;
        const result = await db.run(
            'INSERT INTO blogs (title, slug, content, excerpt, image_url, category, published) VALUES (?,?,?,?,?,?,?)',
            [title, slug, content || '', excerpt || '', image_url, category || '', published === '1' || published === true ? 1 : 0]
        );
        res.status(201).json(await db.get('SELECT * FROM blogs WHERE id = ?', [result.lastInsertRowid]));
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Slug already exists' });
        res.status(500).json({ error: 'Failed to create blog' });
    }
});

// Admin: update blog
router.put('/:id', authMiddleware, imageUpload.single('image'), async (req, res) => {
    try {
        const { title, slug, content, excerpt, category, published } = req.body;
        let image_url = null;
        if (req.file) {
            const old = await db.get('SELECT image_url FROM blogs WHERE id = ?', [req.params.id]);
            if (old?.image_url) await deleteFromSupabase(old.image_url);
            image_url = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype, 'images');
        }
        const pubVal = published === '1' || published === true || published === 'true' ? 1 : published === '0' || published === false || published === 'false' ? 0 : null;
        await db.run(
            'UPDATE blogs SET title=COALESCE(?,title), slug=COALESCE(?,slug), content=COALESCE(?,content), excerpt=COALESCE(?,excerpt), image_url=COALESCE(?,image_url), category=COALESCE(?,category), published=COALESCE(?,published), updated_at=CURRENT_TIMESTAMP WHERE id=?',
            [title || null, slug || null, content || null, excerpt || null, image_url, category || null, pubVal, req.params.id]
        );
        res.json(await db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id]));
    } catch (err) { res.status(500).json({ error: 'Failed to update blog' }); }
});

// Admin: delete
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const old = await db.get('SELECT image_url FROM blogs WHERE id = ?', [req.params.id]);
        if (old?.image_url) await deleteFromSupabase(old.image_url);
        await db.run('DELETE FROM blogs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
