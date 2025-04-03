const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer(); // memory storage
const { UpdateUserProfile, UpdateUserPassword } = require('../controllers/UpdateUserController');


router.put('/me/password', authMiddleware, UpdateUserPassword);
router.put('/me', authMiddleware, upload.single('avatar'), UpdateUserProfile);


module.exports = router;