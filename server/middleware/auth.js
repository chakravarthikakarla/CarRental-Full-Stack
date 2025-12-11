// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) =>{
//     const token = req.headers.authorization;
//     if(!token){
//         return res.json({success:false, message:"not authorized"})
//     }
//     try{
//         const userId = jwt.decode(token, process.env.JWT_SECRET)

//         if(!userId){
//             return res.json({success:false, message:"not authorized"})
//         }
//         req.user =  await User.findById(userId).select("-password")
//         if (!req.user) {
//       return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
//     }
//         next();
//     }catch (error){
//         return res.json({success:false, message:"not authorized"})


//     }
// }


// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== "string") {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // Expect header: "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ success: false, message: "Malformed authorization header" });
    }
    const token = parts[1];

    // Verify token (throws if invalid/expired)
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // We stored payload as { id: userId } when generating token
    const userId = payload?.id ?? payload; // fallback in case payload was a raw id

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    req.user = user;
    return next();
  } catch (err) {
    // jwt.verify throws errors we can map to 401
    console.error("Auth error:", err?.message ?? err);
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};
