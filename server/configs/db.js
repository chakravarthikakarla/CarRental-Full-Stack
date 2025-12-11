// import mongoose from "mongoose";

// const connectDB = async ()=>{
//     try{
//         mongoose.connection.on('connected' , ()=>console.log("Database Connected"));
//         await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`)
//     }
//     catch (error) {
//         console.log(error.message);
//     }
// }

// export default connectDB


// configs/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI environment variable.");
    process.exit(1);
  }

  // Optional: if you prefer adding database name here, do it intentionally:
  // const dbName = process.env.MONGODB_DB || "car-rental";
  // const finalUri = uri.includes("/") ? uri : `${uri}/${dbName}`;
  const finalUri = uri; // expect full connection string in env variable

  // Optional Mongoose settings
  // mongoose.set("strictQuery", false); // depending on your app needs

  // Connection event listeners
  mongoose.connection.on("connected", () => console.log("Database connected"));
  mongoose.connection.on("error", (err) =>
    console.error("Mongoose connection error:", err)
  );
  mongoose.connection.on("disconnected", () =>
    console.warn("Mongoose disconnected")
  );

  try {
    await mongoose.connect(finalUri);
    // you can also log mongoose.connection.readyState if desired
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Exit so the process doesn't run without DB
    process.exit(1);
  }
};

export default connectDB;
