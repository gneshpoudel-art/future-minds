const db = require('./backend/src/db/client');
require('dotenv').config({ path: './backend/.env' });

async function check() {
    try {
        const branches = await db.all('SELECT branch_name, email FROM branches');
        console.log('Branches in DB:', JSON.stringify(branches, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}
check();
