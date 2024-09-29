const Profile = require('../models/profile');

const profile = {
    storeProfilePicture: async (req, res, next) => {

        try {

            const imagePath = `/uploads/${req.file.filename}`;
        
            // Create a new user with the profile picture
            const profile = new Profile({ profilePicture: imagePath });
            await profile.save();            
        
            res.json({ message: 'Profile picture uploaded successfully', imagePath });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    },

    fetchProfilePicture: async (req, res, next) => {
        try {

            const user = await Profile.findOne({ userId });
        
            if (!user || !user.profilePicture) {
              return res.status(404).json({ error: 'Profile picture not found' });
            }
        
            res.json({ imagePath: user.profilePicture });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    },

    updateProfilePicture : async (req, res) => {
        try {
            const userId = req.params.userId;
            const imagePath = `/uploads/${req.file.filename}`;
        
            let user = await Profile.findOne({ userId });
        
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }
        
            user.profilePicture = imagePath;
            await user.save();
        
            res.json({ message: 'Profile picture updated successfully', imagePath });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = profile;
