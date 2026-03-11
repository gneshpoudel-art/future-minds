const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const UPLOAD_DIR = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
const IMAGE_DIR = path.join(UPLOAD_DIR, 'images');
const FILE_DIR = path.join(UPLOAD_DIR, 'files');

[UPLOAD_DIR, IMAGE_DIR, FILE_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
];

function createStorage(dest) {
    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, dest),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${uuidv4()}${ext}`);
        },
    });
}

const imageUpload = multer({
    storage: createStorage(IMAGE_DIR),
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
    storage: createStorage(FILE_DIR),
    limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 50) * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, ZIP'));
        }
    },
});

function getFileUrl(req, filename, subfolder = 'images') {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/${subfolder}/${filename}`;
}

module.exports = { imageUpload, fileUpload, getFileUrl, IMAGE_DIR, FILE_DIR };
