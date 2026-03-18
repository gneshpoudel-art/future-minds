const router = require('express').Router();
const db = require('../db/client');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.post('/', [
    body('full_name').trim().isLength({ min: 2, max: 100 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().isLength({ min: 5, max: 2000 }).escape(),
    body('phone').optional().trim().isLength({ max: 30 }).escape(),
    body('branch').optional().trim().isLength({ max: 200 }).escape(),
    body('subject').optional().trim().isLength({ max: 200 }).escape(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { full_name, email, phone, branch, subject, preferred_date, service, message, form_type } = req.body;
        console.log(`[Contact] ${form_type || 'inquiry'} from ${full_name} for branch ${branch || 'none'}`);
        await db.run(
            'INSERT INTO contact_submissions (full_name, email, phone, branch, subject, preferred_date, service, message, form_type) VALUES (?,?,?,?,?,?,?,?,?)',
            [full_name, email, phone || '', branch || '', subject || '', preferred_date || '', service || '', message, form_type || 'inquiry']
        );
        res.status(201).json({ message: 'Your message has been received. We will contact you shortly.' });
    } catch (err) {
        console.error('[Contact] Error:', err.message);
        res.status(500).json({ error: 'Failed to submit message' });
    }
});

// Admin: view submissions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { form_type } = req.query;
        let sql = 'SELECT * FROM contact_submissions';
        const args = [];
        if (form_type) { sql += ' WHERE form_type = ?'; args.push(form_type); }
        sql += ' ORDER BY created_at DESC';
        res.json(await db.all(sql, args));
    } catch (err) { res.status(500).json({ error: 'Failed to fetch submissions' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await db.run('DELETE FROM contact_submissions WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
