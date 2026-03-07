const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const ownerOnly = (req, res, next) => {
    if (req.user && req.user.UserType === 'Landlord') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an owner' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.UserType === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, ownerOnly, adminOnly };
