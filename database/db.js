const mongoose = require("mongoose");


const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connect to database successfully");
  } catch (e) {
    console.log("Can't connect to database!!!!!");
    process.exit(1);
  }
};

module.exports = connectToDb;
