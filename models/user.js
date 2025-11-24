const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, trim: true, unique: true },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: { type: String, enum: ["user", "admin"],default:"user" }
  },
  { timestamps: true }
);

module.exports=mongoose.model("user",userSchema);
