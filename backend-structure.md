# Backend Structure

## Overview
The backend of HouseHunt is built using Node.js and Express.js. It is responsible for handling API requests, managing user authentication, interacting with the MongoDB database, and controlling the business logic of the application.

## Backend Folder Structure

```
server
│
├── config
│   └── db.js
│
├── models
│   ├── User.js
│   ├── Property.js
│   └── Booking.js
│
├── routes
│   ├── userRoutes.js
│   ├── propertyRoutes.js
│   └── bookingRoutes.js
│
├── controllers
│   ├── userController.js
│   ├── propertyController.js
│   └── bookingController.js
│
├── middleware
│   └── authMiddleware.js
│
└── server.js
```

## Explanation of Folders

**config**  
Contains configuration files such as the MongoDB database connection.

**models**  
Defines the MongoDB schemas using Mongoose. Examples include User, Property, and Booking models.

**routes**  
Defines API endpoints that connect frontend requests to backend logic.

**controllers**  
Contains the business logic for handling requests and sending responses.

**middleware**  
Includes functions that run before route handlers, such as authentication and authorization.

**server.js**  
The main entry point of the backend application that starts the Express server.
