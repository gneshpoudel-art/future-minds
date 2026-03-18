require('dotenv').config();
const db = require('./src/db/client');

async function migrate() {
    console.log('[Migration] Starting...');
    const client = db.getClient();

    try {
        // 1. Add email to branches
        console.log('[Migration] Adding email to branches...');
        await client.execute("ALTER TABLE branches ADD COLUMN email TEXT DEFAULT 'info@futureminds.edu.np' NOT NULL;");
        console.log('[Migration] Success: Added email to branches');
    } catch (e) {
        if (e.message.includes('duplicate column')) {
            console.log('[Migration] Skipped: email already exists in branches');
        } else {
            console.error('[Migration] Failed to add email to branches:', e.message);
        }
    }

    try {
        // 2. Add branch to contact_submissions
        console.log('[Migration] Adding branch to contact_submissions...');
        await client.execute("ALTER TABLE contact_submissions ADD COLUMN branch TEXT;");
        console.log('[Migration] Success: Added branch to contact_submissions');
    } catch (e) {
        if (e.message.includes('duplicate column')) {
            console.log('[Migration] Skipped: branch already exists in contact_submissions');
        } else {
            console.error('[Migration] Failed to add branch to contact_submissions:', e.message);
        }
    }

    console.log('[Migration] Finished.');
}

migrate();
