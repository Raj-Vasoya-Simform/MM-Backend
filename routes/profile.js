const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profile')

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Save the uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.png'); // Assuming PNG files
    },
  });

const upload = multer({ storage: storage });

// Store profile picture
router.post('/store', upload.single('profilePicture'), profileController.storeProfilePicture);

// Fetch profile picture
router.get('/fetch/:userId', profileController.fetchProfilePicture);

// Update profile picture
router.put('/update/:userId', upload.single('profilePicture'), profileController.updateProfilePicture);

module.exports = router;
