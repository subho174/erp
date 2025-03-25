const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log("DB CONNECTED");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
