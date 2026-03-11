require('dotenv').config();
const { runSchema } = require('./db/client');

async function start() {
    console.log('[Server] Initializing database schema...');
    await runSchema();
    console.log('[Server] Schema ready.');

    const app = require('./app');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`[Server] Future Minds API running on http://localhost:${PORT}`);
        console.log(`[Server] Admin panel: http://localhost:${PORT}/admin`);
        console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });
}

start().catch(err => {
    console.error('[Server] Startup error:', err);
    process.exit(1);
});
