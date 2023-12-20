const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images'); // Destination folder for uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname); // Unique filename for each uploaded image
    },
});

// Multer file filter configuration
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true); // Accept the file
    } else {
        cb(null, false); // Reject the file
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        // set file size limit to 10MB
        fileSize: 1024 * 1024 * 10,
    },
});

module.exports = upload;
