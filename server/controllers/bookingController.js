import Booking from "../models/Booking.js";
import Car from "../models/car.js";

// Function to check Availability of car for a given date
const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return bookings.length === 0;
};

// API to check Availability of cars for given data and location
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // Get all cars at the given location
    const cars = await Car.find({ location, isAvailable: true });

    // Check which cars are available for the date range
    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return isAvailable ? { ...car.toObject() } : null;
    });

    const availableCars = (await Promise.all(availableCarsPromises)).filter(car => car !== null);

    res.json({ success: true, availableCars });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


//API to create Booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }
    const carData = await Car.findById(car);

    // calculate price based on pickupDate and returnDate
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });
    res.json({ success: true, message: "Booking Created" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API  to List User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to get Owner Bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.json({ success: false, message: 'Unauthorized' });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate('car')
      .populate({ path: 'user', select: '-password' })
      .sort({ createdAt: -1 });

    // Filter out bookings where car is null
    const validBookings = bookings.filter(b => b.car !== null);

    res.json({ success: true, bookings: validBookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



//API to change booking status
export const changeBookingStatus = async (req,res) =>{
 try {
        const { _id } = req.user;
        const {bookingId, status} = req.body


        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"Unauthorized"})
        }

        booking.status = status;
        await booking.save();
        res.json({success: true, message:"Status Updated"})


    
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

