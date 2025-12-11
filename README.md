
# CarRental – Full Stack Car Rental Platform

A modern full-stack web application where users can browse cars, check availability, book rentals, and owners can upload and manage their vehicles.

## Demo / Live

Frontend: 
https://car-rental-ten-blush.vercel.app

Backend: 
https://car-rental-server-orcin.vercel.app



## Features

### User Features

* User registration and login (JWT authentication)
* Browse all available cars
* Search cars by brand, model, category, or transmission
* Check availability based on location, pickup date, and return date
* View car details, features, and pricing
* Book any available car
* View personal bookings with status, dates, and total price

### Owner Features

* Upgrade account to "Owner" role
* Add new cars with full details and image upload using ImageKit
* Update profile image
* View all uploaded cars
* Toggle car availability
* Remove cars from listing
* Owner dashboard showing:

  * Total cars listed
  * Total bookings
  * Pending and confirmed bookings
  * Monthly revenue
  * Recent bookings

### Backend Features

* Secure REST APIs using Express.js
* MongoDB & Mongoose data modeling
* Multer for image uploads
* ImageKit integration for optimized image hosting
* Booking system with conflict detection
* Role-based access control

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Motion
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, ImageKit
* **Database:** MongoDB Atlas


### Clone the repository

```bash
git clone https://github.com/chakravarthikakarla/CarRental-Full-Stack.git
cd CarRental-Full-Stack
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `/server` with:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

Run backend:

```bash
npm run server
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `/client` with:

```
VITE_BASE_URL=http://localhost:3000
VITE_CURRENCY=₹
```

Run frontend:

```bash
npm run dev
```

---

## Folder Structure

```
CarRental-Full-Stack/
│── client/         # Frontend (React + Vite)
│── server/         # Backend (Node + Express)
│── controllers/    # API Logic
│── routes/         # API Endpoints
│── models/         # MongoDB Schemas
└── README.md
```

## Future Improvements

* Payment gateway integration
* Car reviews and ratings
* Admin dashboard
* Multi-city pickup and drop-off options

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## Support

If you like this project, please ⭐ the repository!

---


