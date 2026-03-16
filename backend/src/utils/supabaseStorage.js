const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY - uploads will fail');
}

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

const BUCKET = process.env.SUPABASE_BUCKET || 'uploads';
console.log('[Supabase] Using bucket:', BUCKET);

/**
 * Upload a file buffer to Supabase Storage.
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} originalname - Original file name (to get extension)
 * @param {string} mimetype - MIME type of the file
 * @param {string} folder - Subfolder in the bucket (e.g. 'images', 'files')
 * @returns {Promise<string>} Public URL of the uploaded file
 */
async function uploadToSupabase(buffer, originalname, mimetype, folder = 'images') {
    try {
        const ext = path.extname(originalname).toLowerCase();
        const filename = `${folder}/${uuidv4()}${ext}`;
        
        console.log('[Supabase] Uploading:', filename);

        const { data, error } = await supabase.storage
            .from(BUCKET)
            .upload(filename, buffer, {
                contentType: mimetype,
                upsert: false,
            });

        if (error) {
            console.error('[Supabase] Upload error:', error);
            throw new Error('Supabase upload failed: ' + (error.message || JSON.stringify(error)));
        }

        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
        console.log('[Supabase] Upload success:', filename);
        return urlData.publicUrl;
    } catch (err) {
        console.error('[Supabase] Upload exception:', err.message);
        throw err;
    }
}

/**
 * Delete a file from Supabase Storage by its public URL.
 * @param {string} publicUrl - The full public URL stored in the database
 */
async function deleteFromSupabase(publicUrl) {
    if (!publicUrl || !publicUrl.includes('/storage/v1/object/public/' + BUCKET + '/')) return;
    try {
        const parts = publicUrl.split('/storage/v1/object/public/' + BUCKET + '/');
        if (parts.length < 2) return;
        const filePath = parts[1];
        await supabase.storage.from(BUCKET).remove([filePath]);
    } catch (e) {
        console.warn('[storage] Failed to delete from Supabase:', e.message);
    }
}

module.exports = { uploadToSupabase, deleteFromSupabase };
