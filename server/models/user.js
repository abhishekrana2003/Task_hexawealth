const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password is not required for Google users
    googleId: { type: String, unique: true, sparse: true }, // Sparse ensures only non-null values are unique
    name: { type: String }, // Name from Google profile
});

module.exports = mongoose.model('User', userSchema);