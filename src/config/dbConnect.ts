import mongoose from "mongoose";
require("dotenv").config;

mongoose.set("strictQuery", false);

const MONGO_DB_URI = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.DEV_MONGO_URI;
  } else if (process.env.NODE_ENV === "test") {
    return process.env.TEST_MONGODB_URI;
  } else if (process.env.NODE_ENV === "production") {
    return process.env.PROD_MONGODB_URI;
  }
};

const DB_CONNECT = async () => {
  const MONGODB_URI = MONGO_DB_URI() as string;

  try {
    await mongoose.connect(MONGODB_URI, { autoIndex: true });
    console.log("connected to the database succesfully")
  } catch (err) {
    console.log(err);
    throw new Error("Error connecting db");
    process.exit()
  }
};

export default DB_CONNECT