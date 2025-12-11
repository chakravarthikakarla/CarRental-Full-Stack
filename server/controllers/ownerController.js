// import { error } from "console";
// import imagekit from "../configs/imagekit.js";
// import Car from "../models/car.js";
// import User from "../models/User.js";
// import fs from "fs";
// import Booking from "../models/Booking.js";

// // API to change role
// export const changeRolleToOwner = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     await User.findByIdAndUpdate(_id, { role: "owner" });
//     res.json({ success: true, message: "Now you can list cars" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // API to List Car
// export const addCar = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     let car = JSON.parse(req.body.carData);
//     const imageFile = req.file;

//     // upload image to imagekit
//     const fileBuffer = fs.readFileSync(imageFile.path);
//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/cars",
//     });

//     // optimized through imagekit URL transformation
//     var optimizedImageUrl = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { width: "1280" }, //Width resizing
//         { quality: "auto" }, //auto compression
//         { format: "webp" }, //convert to modern format
//       ],
//     });

//     const image = optimizedImageUrl;
//     await Car.create({ ...car, owner: _id, image });

//     res.json({ success: true, message: "Car Added" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // API to list cars
// export const getOwnerCars = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const cars = await Car.find({ owner: _id });
//     res.json({ success: true, cars });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // API to Toggle car Availability
// export const toggleCarAvailability = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { carId } = req.body;
//     const car = await Car.findById(carId);

//     // checking is car belongs to user
//     if (car.owner.toString() !== _id.toString()) {
//       return res.json({ success: false, message: "Unauthorized" });
//     }

//     car.isAvailable = !car.isAvailable;
//     await car.save();

//     res.json({ success: true, message: "Availability Toggled" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // API to delete a car
// export const deleteCar = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { carId } = req.body;
//     const car = await Car.findById(carId);

//     // checking is car belongs to user
//     if (car.owner.toString() !== _id.toString()) {
//       return res.json({ success: false, message: "Unauthorized" });
//     }
//     car.owner = null;
//     car.isAvailable = false;

//     await car.save();

//     res.json({ success: true, message: "Car Removed " });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // API to get dashboard data
// export const getdashboardData = async (req, res) => {
//   try {
//     const { _id, role } = req.user;

//     if (role != "owner") {
//       return res.json({ success: false, message: "Unauthorized" });
//     }

//     const cars = await Car.find({ owner: _id });
//     const bookings = await Booking.find({ owner: _id })
//       .populate("car")
//       .sort({ createdAt: -1 });

//     const pendingBookings = await Booking.find({
//       owner: _id,
//       status: "pending",
//     });
//     const completedBookings = await Booking.find({
//       owner: _id,
//       status: "confirmed",
//     });

//     // calculate monthlyRevenue from bookings where status is confirmed
//     const monthlyRevenue = bookings
//       .slice()
//       .filter((booking) => booking.status === "confirmed")
//       .reduce((acc, booking) => acc + booking.price, 0);

//     const dashboardData = {
//       totalCars: cars.length,
//       totalBookings: bookings.length,
//       pendingBookings: pendingBookings.length,
//       completedBookings: completedBookings.length,
//       recentBookings: bookings.slice(0, 3),
//       monthlyRevenue,
//     };
//         res.json({ success: true, dashboardData });

//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// //API to update user image

// export const updateUserImage = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const imageFile = req.file;

//     // upload image to imagekit
//     const fileBuffer = fs.readFileSync(imageFile.path);
//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/users",
//     });

//     // optimized through imagekit URL transformation
//     var optimizedImageUrl = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { width: "1280" }, //Width resizing
//         { quality: "auto" }, //auto compression
//         { format: "webp" }, //convert to modern format
//       ],
//     });

//     const image = optimizedImageUrl;

//     await User.findByIdAndUpdate(_id, { image });
//     res.json({ success: true, message: "Image Updated" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };


// controllers/ownerController.js


// controllers/ownerController.js
import imagekit from "../configs/imagekit.js";
import Car from "../models/car.js";
import User from "../models/User.js";
import fs from "fs";
import Booking from "../models/Booking.js";

/**
 * Change role to owner
 */
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    return res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.error("changeRoleToOwner error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Add a car (expects protect middleware before upload)
 * req.body.carData (stringified JSON) and req.file (multer)
 */
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!req.body.carData) {
      return res.status(400).json({ success: false, message: "Missing car data" });
    }
    const car = JSON.parse(req.body.carData);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file required" });
    }
    const imageFile = req.file;

    // If you're using multer.memoryStorage(), use req.file.buffer instead of fs.readFileSync
    const fileBuffer = imageFile.buffer ?? fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // Clean up temp file if disk storage used
    if (imageFile.path) {
      try { fs.unlinkSync(imageFile.path); } catch (e) { /* ignore */ }
    }

    const filePath = response.filePath || response.name || null;
    if (!filePath) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    const optimizedImageUrl = imagekit.url({
      path: filePath,
      transformation: [{ width: "1280" }, { quality: "auto" }, { format: "webp" }],
    });

    await Car.create({ ...car, owner: _id, image: optimizedImageUrl });
    return res.status(201).json({ success: true, message: "Car added" });
  } catch (error) {
    console.error("addCar error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get owner cars
 */
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    return res.json({ success: true, cars });
  } catch (error) {
    console.error("getOwnerCars error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle availability
 */
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();
    return res.json({ success: true, message: "Availability toggled" });
  } catch (error) {
    console.error("toggleCarAvailability error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete (soft-remove) car
 */
export const deleteCar = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    if (car.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = false;
    car.removed = true;              // new boolean flag
    // DON'T set car.owner = null (keeps schema valid)
    await car.save();

    return res.json({ success: true, message: "Car removed (soft)" });
  } catch (error) {
    console.error("deleteCar error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * Dashboard data for owner
 */
export const getdashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = bookings.filter(b => b.status === "pending");
    const completedBookings = bookings.filter(b => b.status === "confirmed");

    const monthlyRevenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((acc, booking) => acc + (booking.price || 0), 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    return res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("getdashboardData error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update user image (expects protect then upload)
 */
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!req.file) return res.status(400).json({ success: false, message: "Image file required" });

    const imageFile = req.file;
    const fileBuffer = imageFile.buffer ?? fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    if (imageFile.path) {
      try { fs.unlinkSync(imageFile.path); } catch (e) {}
    }

    const filePath = response.filePath || response.name || null;
    if (!filePath) return res.status(500).json({ success: false, message: "Image upload failed" });

    const optimizedImageUrl = imagekit.url({
      path: filePath,
      transformation: [{ width: "1280" }, { quality: "auto" }, { format: "webp" }],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });
    return res.json({ success: true, message: "Image updated" });
  } catch (error) {
    console.error("updateUserImage error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
