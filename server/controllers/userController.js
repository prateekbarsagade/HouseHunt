const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, type) => {
    return jwt.sign({ id, UserType: type }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { Name, Email, Phone, Password, UserType } = req.body;
        const userExists = await User.findOne({ Email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const user = await User.create({
            Name, Email, Phone, Password: hashedPassword, UserType
        });

        res.status(201).json({
            _id: user.id, Name: user.Name, Email: user.Email, UserType: user.UserType,
            token: generateToken(user.id, user.UserType)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });

        if (user && (await bcrypt.compare(Password, user.Password))) {
            res.json({
                _id: user.id, Name: user.Name, Email: user.Email, UserType: user.UserType,
                token: generateToken(user.id, user.UserType)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const { location, propertyType, adType } = req.query;
        let query = {};
        if (location) query.Location = new RegExp(location, 'i');
        if (propertyType) query.PropertyType = propertyType;
        if (adType) query.AdType = adType;

        const properties = await Property.find(query).populate('OwnerID', 'Name Email Phone');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bookProperty = async (req, res) => {
    try {
        const { propertyId, startDate, endDate } = req.body;

        // Validate property exists and is available
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        if (property.Status === 'Booked') return res.status(400).json({ message: 'Property is already booked' });

        const booking = await Booking.create({
            PropertyID: propertyId,
            TenantID: req.user.id,
            StartDate: startDate || new Date(),
            EndDate: endDate,
            Status: 'Pending'
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ TenantID: req.user.id })
            .populate({
                path: 'PropertyID',
                populate: { path: 'OwnerID', select: 'Name Email Phone' }
            });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getAllProperties, bookProperty, getMyBookings };
