# MongoDB Configuration

## Overview

HouseHunt uses MongoDB as the database to store user data, property listings, and booking information. MongoDB is connected to the Node.js backend using Mongoose.

## Required Packages

The backend uses the following packages for database connectivity:

- mongoose
- dotenv

These packages can be installed using npm.

```
npm install mongoose dotenv
```

## Database Connection File

The database connection is configured in the `config/db.js` file.

Example code:

```
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Environment Variables

Database credentials are stored in a `.env` file for security.

Example:

```
MONGO_URI=mongodb://localhost:27017/househunt
JWT_SECRET=your_secret_key
```

## Database Collections

The application uses the following main collections:

- Users
- Properties
- Bookings

These collections store user accounts, property listings, and rental booking information.
