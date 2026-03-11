const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Signup = require('./models/signup.models.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/signup', async (req, res) => {
    try {
        const user = await Signup.find();

        if (user.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log("Error connecting to MongoDB:", err.message));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
