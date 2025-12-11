// import Booking from "../models/Booking.js";
// import Car from "../models/car.js";

// // Function to check Availability of car for a given date
// const checkAvailability = async (carId, pickupDate, returnDate) => {
//   const bookings = await Booking.find({
//     car: carId,
//     pickupDate: { $lte: returnDate },
//     returnDate: { $gte: pickupDate },
//   });
//   return bookings.length === 0;
// };

// // API to check Availability of cars for given data and location
// export const checkAvailabilityOfCar = async (req, res) => {
//   try {
//     const { location, pickupDate, returnDate } = req.body;

//     // Get all cars at the given location
//     const cars = await Car.find({ location, isAvailable: true });

//     // Check which cars are available for the date range
//     const availableCarsPromises = cars.map(async (car) => {
//       const isAvailable = await checkAvailability(
//         car._id,
//         pickupDate,
//         returnDate
//       );
//       return isAvailable ? { ...car.toObject() } : null;
//     });

//     const availableCars = (await Promise.all(availableCarsPromises)).filter(car => car !== null);

//     res.json({ success: true, availableCars });

//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };


// //API to create Booking
// export const createBooking = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { car, pickupDate, returnDate } = req.body;

//     const picked = new Date(pickupDate);
//     const returned = new Date(returnDate);

//     // ❗ 1. Validate date logic
//     if (returned < picked) {
//       return res.status(400).json({
//         success: false,
//         message: "Return date must be on or after pickup date",
//       });
//     }

//     // 2. Check availability
//     const isAvailable = await checkAvailability(car, pickupDate, returnDate);
//     if (!isAvailable) {
//       return res.status(400).json({ success: false, message: "Car is not available" });
//     }

//     const carData = await Car.findById(car);
//     if (!carData) {
//       return res.status(404).json({ success: false, message: "Car not found" });
//     }

//     // ✅ 3. Calculate no. of days and price
//     const noOfDays = Math.max(
//       Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)),
//       1
//     );
//     const price = carData.pricePerDay * noOfDays;

//     // 🛠️ Optional log for debugging
//     console.log(`Booking for ${noOfDays} day(s), Total Price: $${price}`);

//     // 4. Create booking
//     await Booking.create({
//       car,
//       owner: carData.owner,
//       user: _id,
//       pickupDate,
//       returnDate,
//       price,
//     });

//     return res.status(201).json({ success: true, message: "Booking Created" });

//   } catch (error) {
//     console.error("Booking creation failed:", error.message);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// //API  to List User Bookings
// export const getUserBookings = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const bookings = await Booking.find({ user: _id })
//       .populate("car")
//       .sort({ createAt: -1 });
//     res.json({ success: true, bookings });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// //API to get Owner Bookings
// export const getOwnerBookings = async (req, res) => {
//   try {
//     if (req.user.role !== 'owner') {
//       return res.json({ success: false, message: 'Unauthorized' });
//     }

//     const bookings = await Booking.find({ owner: req.user._id })
//       .populate('car')
//       .populate({ path: 'user', select: '-password' })
//       .sort({ createdAt: -1 });

//     // Filter out bookings where car is null
//     const validBookings = bookings.filter(b => b.car !== null);

//     res.json({ success: true, bookings: validBookings });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };



// //API to change booking status
// export const changeBookingStatus = async (req,res) =>{
//  try {
//         const { _id } = req.user;
//         const {bookingId, status} = req.body


//         const booking = await Booking.findById(bookingId)

//         if(booking.owner.toString() !== _id.toString()){
//             return res.json({success:false, message:"Unauthorized"})
//         }

//         booking.status = status;
//         await booking.save();
//         res.json({success: true, message:"Status Updated"})


    
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };


// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Car from "../models/car.js";

/** Helper: Ensure valid Date objects */
const toDate = (val) => {
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? null : d;
};

const checkAvailability = async (carId, pickupDate, returnDate) => {
  const pickups = toDate(pickupDate);
  const returns = toDate(returnDate);
  if (!pickups || !returns) throw new Error("Invalid dates provided");

  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returns },
    returnDate: { $gte: pickups },
  });
  return bookings.length === 0;
};

export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;
    if (!location || !pickupDate || !returnDate) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const cars = await Car.find({ location, isAvailable: true });

    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
      return isAvailable ? { ...car.toObject() } : null;
    });

    const availableCars = (await Promise.all(availableCarsPromises)).filter(Boolean);
    return res.json({ success: true, availableCars });
  } catch (error) {
    console.error("checkAvailabilityOfCar error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const picked = toDate(pickupDate);
    const returned = toDate(returnDate);
    if (!picked || !returned) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }

    if (returned < picked) {
      return res.status(400).json({
        success: false,
        message: "Return date must be on or after pickup date",
      });
    }

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Car is not available" });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const noOfDays = Math.max(Math.ceil((returned - picked) / msPerDay), 1);
    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car,
      owner: carData.owner,
      user: userId,
      pickupDate: picked,
      returnDate: returned,
      price,
      status: "pending",
    });

    return res.status(201).json({ success: true, message: "Booking created" });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 }); // fixed field
    return res.json({ success: true, bookings });
  } catch (error) {
    console.error("getUserBookings error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car")
      .populate({ path: "user", select: "-password" })
      .sort({ createdAt: -1 });

    const validBookings = bookings.filter((b) => b.car !== null);
    return res.json({ success: true, bookings: validBookings });
  } catch (error) {
    console.error("getOwnerBookings error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changeBookingStatus = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { bookingId, status } = req.body;
    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();
    return res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("changeBookingStatus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

