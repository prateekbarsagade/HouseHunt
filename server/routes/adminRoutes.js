const express = require('express');
const router = express.Router();
const { getAllUsers, getAllProperties, getAllBookings, makeUserOwner } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.get('/bookings', getAllBookings);
router.put('/users/:id/makeowner', makeUserOwner);

module.exports = router;
