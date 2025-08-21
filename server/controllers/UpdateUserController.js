// controllers/userController.js
const pool = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');
const multer = require('multer');
const bcrypt = require('bcrypt');
exports.UpdateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, bio } = req.body;
  let avatarUrl = null;

  try {
    // If image is provided
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'avatars' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const uploadResult = await streamUpload(req);
      avatarUrl = uploadResult.secure_url;
    }

    // Update name and avatar URL in DB
    await pool.query(
      `UPDATE users SET name = $1, bio = $2, avatar_url = COALESCE($3, avatar_url) WHERE id = $4`,
      [name, bio, avatarUrl, userId]
    );

    const updated = await pool.query(
      'SELECT id, name, bio, email, avatar_url FROM users WHERE id = $1',
      [userId]
    );

    res.status(200).json(updated.rows[0]);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Profile update failed' });
  }
};
exports.UpdateUserPassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // Get current hashed password
    const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user || !user.password) {
      return res.status(400).json({ message: 'Password update not available for this account.' });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ message: 'Failed to update password.' });
  }
};
