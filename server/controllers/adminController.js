const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-Password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({}).populate('OwnerID', 'Name Email Phone');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('PropertyID').populate('TenantID', 'Name Email Phone');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const makeUserOwner = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Toggle between Landlord and Tenant
        if (user.UserType === 'Landlord') {
            user.UserType = 'Tenant';
            await user.save();
            res.json({ message: 'User is now a Tenant', user });
        } else {
            user.UserType = 'Landlord';
            await user.save();
            res.json({ message: 'User is now a Landlord', user });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, getAllProperties, getAllBookings, makeUserOwner };
