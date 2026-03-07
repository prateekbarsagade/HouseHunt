# Frontend Structure

## Overview

The frontend of RentEase is organized into reusable components and pages to ensure maintainability and scalability.

## Folder Structure

```
client
│
├── public
│
└── src
    ├── components
    │   ├── Navbar.js
    │   ├── PropertyCard.js
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

## Explanation

components  
Reusable UI elements such as navigation bars and cards.

pages  
Main application screens like Home, Login, and Property Details.

services  
Handles API communication using Axios.

App.js  
Main entry component controlling routes and layout.
