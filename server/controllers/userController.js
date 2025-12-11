// import User from "../models/User.js"
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
// import Car from "../models/car.js";

// // Generate JWT Token
// const generateToken = (userId)=>{
//     const payload = userId;
//     return jwt.sign(payload, process.env.JWT_SECRET)
// }

// // Registered User
// // Registered User
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validate fields
//     if (!name || !email || !password || password.length < 8) {
//       return res.json({ success: false, message: 'Fill all the fields (password must be at least 8 characters)' });
//     }

//     // Check if user already exists
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//       return res.json({ success: false, message: 'User already exists' });
//     }

//     // Hash password and create user
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashedPassword, role: 'user' });

//     // Generate JWT token
//     const token = generateToken(user._id.toString());

//     // Return consistent response with login
//     res.json({
//       success: true,
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       },
//       message: 'Account created successfully!'
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };


// // Login User
// export const loginUser =  async(req,res)=>{
//      try{
//         const {name, email,password} = req.body
//         const user = await User.findOne({email})
//         if(!user){
//             return res.json({success:false, message: "User not found"})
//         }
//         const isMatch = await bcrypt.compare(password, user.password)
//         if(!isMatch){
//             return res.json({success:false, message:"Invalid Credentials"})
//         }
//         const token = generateToken(user._id.toString())
//         res.json({success:true, token})
//      }catch (error){

//         console.log(error.message);
//         res.json({success:false, message:error.message})

//      }
//     }
//     // Get user data using token
//     export const getUserData = async (req, res) =>{
//         try{
//             const {user} =req;
//             res.json({success:true, user})

//         }
//         catch (error){
//             console.log(error.message);
//             res.json({success:true, message:error.message})
//         }
    
//     }

//     //Get all cars for the frontend
//     export const getCars = async (req, res) =>{
//         try{
//            const cars = await Car.find({isAvailable: true})
//             res.json({success:true, cars})


//         }
//         catch (error){
//             console.log(error.message);
//             res.json({success:true, message:error.message})
//         }
    
//     }


// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/car.js";

const generateToken = (userId) => {
  const payload = { id: userId };
  // Add expiration to token
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Fill all the fields (password must be at least 8 characters)",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: "user" });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      message: "Account created successfully!",
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // removed unused name
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());
    return res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    return res.json({ success: true, user });
  } catch (error) {
    console.error("getUserData error:", error);
    return res.status(500).json({ success: false, message: error.message }); // fixed success flag
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    return res.json({ success: true, cars });
  } catch (error) {
    console.error("getCars error:", error);
    return res.status(500).json({ success: false, message: error.message }); // fixed success flag
  }
};
