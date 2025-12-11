// import express from "express";
// import { protect } from "../middleware/auth.js";
// import { addCar, changeRolleToOwner, deleteCar, getdashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
// import upload from "../middleware/multer.js";

// const ownerRouter = express.Router();

// ownerRouter.post("/change-role", protect, changeRolleToOwner)
// ownerRouter.post("/add-car", upload.single("image"), protect, addCar)
// ownerRouter.get("/cars",  protect, getOwnerCars)
// ownerRouter.post("/toggle-car",  protect, toggleCarAvailability)
// ownerRouter.post("/delete-car",  protect, deleteCar)


// ownerRouter.get('/dashboard', protect,getdashboardData)
// ownerRouter.post("/update-image", upload.single("image"), protect, updateUserImage)




// export default ownerRouter


import express from "express";
import { protect } from "../middleware/auth.js";
// make sure controller exports match these names
import {
  addCar,
  changeRoleToOwner,    // <-- ensure controller exports this exact name
  deleteCar,
  getdashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage,
} from "../controllers/ownerController.js";

import upload from "../middleware/multer.js"; // or your improved upload middleware

const ownerRouter = express.Router();

// Protect first, then file upload middleware
ownerRouter.post("/change-role", protect, changeRoleToOwner);

// For add-car and update-image: require auth first, then accept file
ownerRouter.post("/add-car", protect, upload.single("image"), addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);

ownerRouter.get("/dashboard", protect, getdashboardData);
// routes/ownerRoutes.js
ownerRouter.post("/update-image", protect, upload.single("image"), updateUserImage);

export default ownerRouter;
