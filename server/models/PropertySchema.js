const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    OwnerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Title: { type: String },
    Description: { type: String },
    Location: { type: String, required: true },
    RentAmount: { type: Number, required: true },
    PropertyType: { type: String, required: true },
    AdType: { type: String, enum: ['rent', 'sale'], default: 'rent' },
    FurnishingStatus: { type: String },
    OwnerContact: { type: String },
    Amenities: [{ type: String }],
    Images: [{ type: String }],
    Status: { type: String, enum: ['Available', 'Booked', 'Unavailable'], default: 'Available' },
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
