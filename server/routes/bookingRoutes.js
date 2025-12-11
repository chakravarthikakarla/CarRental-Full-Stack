// import express from "express";
//  import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
// import { protect } from "../middleware/auth.js";

// const bookingRouter = express.Router()

// bookingRouter.post("/check-availability", checkAvailabilityOfCar)
// bookingRouter.post('/create', protect, createBooking)
// bookingRouter.get('/user', protect, getUserBookings)
// bookingRouter.get('/owner', protect, getOwnerBookings)
// bookingRouter.post('/change-status', protect, changeBookingStatus)

// export default bookingRouter


import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCar,
  createBooking,
  getOwnerBookings,
  getUserBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

// Public availability check (frontend uses it before creating booking)
bookingRouter.post("/check-availability", checkAvailabilityOfCar);

// Protected booking actions
bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/change-status", protect, changeBookingStatus);

export default bookingRouter;
