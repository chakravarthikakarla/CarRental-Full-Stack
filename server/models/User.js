// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {type:String, required:true},
//     email: {type:String, required:true, unique:true},
//     password: {type:String, required:true},
//     role: {type:String, enum: ["owner", "user"], default: 'user'},
//     image: {type:String, default: ''},
// },{timestamps: true})

// const User =mongoose.model('User', userSchema)

// export default User


// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["owner", "user"], default: "user" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

// Remove password when converting to JSON / Object
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
