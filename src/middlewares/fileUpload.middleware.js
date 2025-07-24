import multer from 'multer';
import path from 'path';

let allfileExtension = ['.jpg', '.jpeg', '.png'];

const fileFilter = (req, file, cb) => {
  if (allfileExtension.includes(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! only jpg, jpeg and png allowed'), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/temp');
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default upload;
