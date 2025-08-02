import mongoose, { ConnectOptions, Mongoose } from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri: string | undefined = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable not set');
  }

  try {
    const conn: Mongoose = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions); // satisfies ConnectOptions // Type-safe alternative to "as"

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;

// import mongoose from "mongoose";

// const connectDB = async () => {
//     const mongoUri = process.env.MONGO_URI;


//   if (!mongoUri) {
//     throw new Error('MONGO_URI environment variable not set');
//   }
//     try {
//         const conn = await mongoose.connect(mongoUri as string);
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (err) {
//         console.error(err);
//         process.exit(1);
//     }
// }

// export default connectDB;