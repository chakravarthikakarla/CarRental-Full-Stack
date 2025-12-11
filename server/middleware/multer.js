// import multer from "multer";

// const upload = multer({storage: multer.diskStorage({})})

// export default upload


// middleware/uploadMemory.js
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Accept only images (png/jpg/jpeg/webp)
    if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export default upload;
