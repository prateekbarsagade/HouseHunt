const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const multer = require('multer');
const path = require('path');

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadImages = upload.array('images', 10);

const addProperty = async (req, res) => {
    try {
        const { Location, RentAmount, PropertyType, AdType, OwnerContact, Description, Title, FurnishingStatus } = req.body;

        // Build image paths from uploaded files
        const Images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

        const property = await Property.create({
            OwnerID: req.user.id,
            Title: Title || Location,
            Description,
            Location,
            RentAmount: Number(RentAmount),
            PropertyType,
            AdType: AdType || 'rent',
            FurnishingStatus,
            OwnerContact,
            Images,
            Status: 'Available'
        });
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ OwnerID: req.user.id });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        if (property.OwnerID.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        // Only allow updating specific fields
        const allowedFields = ['Title', 'Description', 'Location', 'RentAmount', 'PropertyType', 'AdType', 'FurnishingStatus', 'OwnerContact', 'Amenities', 'Status'];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        // Handle image uploads on update
        if (req.files && req.files.length > 0) {
            updates.Images = req.files.map(f => `/uploads/${f.filename}`);
        }

        const updated = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        if (property.OwnerID.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await property.deleteOne();
        res.json({ message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwnerBookings = async (req, res) => {
    try {
        const properties = await Property.find({ OwnerID: req.user.id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        const bookings = await Booking.find({ PropertyID: { $in: propertyIds } }).populate('PropertyID').populate('TenantID', 'Name Email Phone');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id).populate('PropertyID');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.PropertyID.OwnerID.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        booking.Status = status;
        await booking.save();

        if (status === 'Confirmed') {
            await Property.findByIdAndUpdate(booking.PropertyID._id, { Status: 'Booked' });
        } else if (status === 'Cancelled' || status === 'Pending') {
            await Property.findByIdAndUpdate(booking.PropertyID._id, { Status: 'Available' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addProperty, getMyProperties, updateProperty, deleteProperty, getOwnerBookings, updateBookingStatus, uploadImages };
