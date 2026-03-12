const multer = require('multer');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
];

// Use memory storage — files are processed and uploaded to Supabase Storage
const memStorage = multer.memoryStorage();

const imageUpload = multer({
    storage: memStorage,
    limits: { fileSize: (parseInt(process.env.MAX_IMAGE_SIZE_MB) || 10) * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid image type. Allowed: JPG, PNG, WebP, GIF'));
        }
    },
});

const fileUpload = multer({
    storage: memStorage,
    limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 50) * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, ZIP'));
        }
    },
});

module.exports = { imageUpload, fileUpload };
