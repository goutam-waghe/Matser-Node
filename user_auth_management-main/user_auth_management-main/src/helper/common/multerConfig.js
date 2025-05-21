import multer from "multer";
import path from "path";

// Define storage location
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "assets/userImages/"); // Save files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Only .png, .jpg, and .jpeg format allowed!"), false);
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB max file size
});

export default upload;
