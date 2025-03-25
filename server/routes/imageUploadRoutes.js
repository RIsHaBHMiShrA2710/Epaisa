const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); // Assuming you're using multer with memory storage
const cloudinary = require('../config/cloudinaryConfig');

router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'your-folder-name' }, // Change to your folder if needed
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Image upload failed' });
      }
      res.status(200).json({ url: result.secure_url });
    }
  );

  // Pipe the file buffer into the upload stream
  uploadStream.end(req.file.buffer);
});

module.exports = router;
