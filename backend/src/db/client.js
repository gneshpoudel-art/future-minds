const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');

let db;

function getClient() {
  if (db) return db;

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoToken && !tursoUrl.startsWith('libsql://your-db')) {
    // Use Turso remote database
    console.log('[DB] Connecting to Turso:', tursoUrl);
    db = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
  } else {
    // Fallback to local SQLite file
    const localPath = process.env.DB_LOCAL_PATH || './data/futureminds.db';
    const absPath = path.resolve(process.cwd(), localPath);
    const dir = path.dirname(absPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    console.log('[DB] Using local SQLite:', absPath);
    db = createClient({ url: `file:${absPath}` });
  }

  return db;
}

async function runSchema() {
  const client = getClient();
  const schemaPath = path.join(__dirname, 'schema.sql');
  const raw = fs.readFileSync(schemaPath, 'utf-8');

  // Remove full-line comments and split on semicolons
  const statements = raw
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Run PRAGMA and CREATE TABLE statements first, then CREATE INDEX
  const tables = statements.filter(s => !s.toUpperCase().startsWith('CREATE INDEX'));
  const indexes = statements.filter(s => s.toUpperCase().startsWith('CREATE INDEX'));

  for (const stmt of [...tables, ...indexes]) {
    try {
      await client.execute(stmt);
    } catch (err) {
      // Ignore "already exists" errors for idempotency
      if (!err.message?.includes('already exists') && !err.message?.includes('duplicate')) {
        console.warn('[Schema] Warning:', err.message?.split('\n')[0]);
      }
    }
  }
}

async function query(sql, args = []) {
  const client = getClient();
  const result = await client.execute({ sql, args });
  return result;
}

async function all(sql, args = []) {
  const result = await query(sql, args);
  return result.rows.map(row => {
    const obj = {};
    result.columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

async function get(sql, args = []) {
  const rows = await all(sql, args);
  return rows[0] || null;
}

async function run(sql, args = []) {
  const result = await query(sql, args);
  return { lastInsertRowid: result.lastInsertRowid, rowsAffected: result.rowsAffected };
}

module.exports = { getClient, runSchema, all, get, run };
