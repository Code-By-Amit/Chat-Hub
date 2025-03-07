const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '../uploads');

(async () => {
    try {
        await fs.promises.mkdir(uploadDir, { recursive: true });
    } catch (err) {
        console.error("❌ Failed to create upload directory:", err);
    }
})();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

module.exports = upload