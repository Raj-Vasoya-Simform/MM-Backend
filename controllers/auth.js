const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Change this line
const registration = require('../models/registration');
const login = require('../models/login');

const auth = {
    registerAdmin: async (req, res, next) => {
        const { email, gstNumber, password, confirmPassword } = req.body;

        try {
            const existingUser = await registration.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: 'GST number already registered' });
            }

            // Check if the passwords match
            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }

            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new registration({ email, gstNumber, password: hashedPassword });
            await newUser.save();

            return res.json({ message: 'Registration successful' });
        } catch (error) {
            console.log(30, error);
            return res.status(500).json({ error: 'Registration failed: ' + error.message });
        }
    },

    loginAdmin: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const existingUser = await registration.findOne({ email });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found. Please register first.' });
            }

            // Compare the entered password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, existingUser.password);

            if (passwordMatch) {
                // Create and send a JWT token on successful login
                const token = jwt.sign({ email: existingUser.email }, 'NOTES@_API', {
                    expiresIn: '24h', // Token expires in 1 hour (adjust as needed)
                });

                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = new login({ email, password: hashedPassword, api_token: token });
                await newUser.save();

                return res.json({ message: 'Login successful', token });
            } else {
                return res.status(401).json({ error: 'Invalid Credentials.' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Login failed: ' + error.message });
        }
    },
};

module.exports = auth;
