const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, require: true },
    publicId: { type: String, require: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("image", imageSchema);
