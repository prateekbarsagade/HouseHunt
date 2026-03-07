const express = require('express');
const router = express.Router();
const { addProperty, getMyProperties, updateProperty, deleteProperty, getOwnerBookings, updateBookingStatus, uploadImages } = require('../controllers/ownerController');
const { protect, ownerOnly } = require('../middlewares/authMiddleware');

router.use(protect, ownerOnly); // all owner routes protected

router.route('/properties')
    .post(uploadImages, addProperty)
    .get(getMyProperties);

router.route('/properties/:id')
    .put(uploadImages, updateProperty)
    .delete(deleteProperty);

router.get('/bookings', getOwnerBookings);
router.put('/bookings/:id', updateBookingStatus);

module.exports = router;
