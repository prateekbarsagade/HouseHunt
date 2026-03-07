const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllProperties, bookProperty, getMyBookings } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/properties', getAllProperties);
router.post('/book', protect, bookProperty);
router.get('/mybookings', protect, getMyBookings);

module.exports = router;
