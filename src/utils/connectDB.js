const mongoose = require("mongoose");
const { MONGO_URI } = require("../config");

const connectDB = async () => {
  await mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};

module.exports = { connectDB };