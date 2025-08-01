import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;


  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable not set');
  }
    try {
        const conn = await mongoose.connect(mongoUri as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;