# Frontend Development

## Overview

The frontend of the HouseHunt application is built using React.js. It provides an interactive and responsive user interface that allows users to browse properties, register accounts, and manage rental listings.

## Technologies Used

The frontend uses the following technologies:

- React.js
- JavaScript
- HTML
- CSS
- Bootstrap
- Axios
- React Router

## Frontend Folder Structure

```
client
│
├── public
│
└── src
    ├── components
    │   ├── Navbar.js
    │   └── PropertyCard.js
    │
    ├── pages
    │   ├── Home.js
    │   ├── Login.js
    │   ├── Register.js
    │   ├── PropertyDetails.js
    │   └── Dashboard.js
    │
    ├── services
    │   └── api.js
    │
    └── App.js
```

## Key Features

The frontend provides the following features:

- User registration and login
- Property browsing and search
- Property listing display
- Booking request functionality
- Dashboard for managing user activities

## API Communication

The frontend communicates with the backend API using Axios. This allows the React application to send HTTP requests to the Node.js server and retrieve data from the MongoDB database.
