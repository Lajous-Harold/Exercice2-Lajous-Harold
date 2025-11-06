import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { autoIndex: true });
  console.log("MongoDB connecté");
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
