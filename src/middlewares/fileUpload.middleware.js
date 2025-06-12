import multer from "multer"
import path from 'path'

const fileFilter = (req, res) => {
    console.log(file)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed!'), false)
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/temp/')
    },
    
    filename: function (req, file, cb) {
        console.log(file)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter
})