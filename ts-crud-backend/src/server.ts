import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB  from './config/db.js';
import colors from 'colors';

const PORT = process.env.PORT || 5000;

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   throw new Error('MONGO_URI is not defined in .env file');
// }

// connectDB(MONGO_URI);


connectDB()

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
  console.log(colors.green(`Server running on port ${PORT}`));
});
