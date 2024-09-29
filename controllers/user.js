const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Change this line
const userRegistrationModel = require('../models/userRegister');
const userLoginModel = require('../models/userLogin');

const user = {
    registerUser: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const existingUser = await userRegistrationModel.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: 'User already registered' });
            }

            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new userRegistrationModel({ email, password: hashedPassword });
            await newUser.save();

            return res.json({ message: 'User Registration successful' });
        } catch (error) {
            return res.status(500).json({ error: 'User Registration failed: ' + error.message });
        }
    },

    loginUser: async (req, res) => {
        const { email, password } = req.body;

        try {
            const existingUser = await userRegistrationModel.findOne({ email });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found. Please register first.' });
            }

            // Compare the entered password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, existingUser.password);

            if (passwordMatch) {
                // Create and send a JWT token on successful login
                const token = jwt.sign({ email: existingUser.email }, 'your-secret-key', {
                    expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
                });

                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = new userLoginModel({ email, password: hashedPassword, token: token });
                await newUser.save();

                return res.json({ message: 'User Login successful', token });
            } else {
                return res.status(401).json({ error: 'Invalid Credentials.' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Login failed: ' + error.message });
        }
    },
};

module.exports = user;
