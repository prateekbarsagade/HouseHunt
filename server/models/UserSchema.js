const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Phone: { type: String, required: true },
    Password: { type: String, required: true },
    UserType: { type: String, enum: ['Tenant', 'Landlord', 'Admin'], required: true },
    ProfileImage: { type: String },
    CurrentLocation: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
