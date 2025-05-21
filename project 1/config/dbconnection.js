import mongoose from "mongoose";

async function dbConnection() {
  await mongoose.connect(`${process.env.MONGO_DB}/project1`);
  console.log("DB CONNECTED!");
}
export default dbConnection;
