import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar, changeRolleToOwner, deleteCar, getdashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRolleToOwner)
ownerRouter.post("/add-car", upload.single("image"), protect, addCar)
ownerRouter.get("/cars",  protect, getOwnerCars)
ownerRouter.post("/toggle-car",  protect, toggleCarAvailability)
ownerRouter.post("/delete-car",  protect, deleteCar)


ownerRouter.get('/dashboard', protect,getdashboardData)
ownerRouter.post("/update-image", upload.single("image"), protect, updateUserImage)




export default ownerRouter