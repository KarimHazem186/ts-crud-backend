import User,{IUser} from "../models/user.model.js";
import { Request, Response,RequestHandler  } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";
import createHttpError from 'http-errors';


// Define a type for the expected request body
interface CreateUserRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}


interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}


type _CreateUserRequest = Request<unknown, unknown, CreateUserBody>;

const createUser = async(req:_CreateUserRequest ,res:Response):Promise<void>=>{
// const createUser = async(req:Request <unknown, unknown, CreateUserBody> ,res:Response):Promise<void>=>{
// const createUser = async(req:CreateUserRequest ,res:Response):Promise<void>=>{
    try {
        console.log(req.body)
        const {name,email,password} : CreateUserBody =req.body;
        
        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const existingUser: IUser | null  = await User.findOne({ email });
            if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        console.log(salt)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser : IUser = new User({ name, email, password:hashedPassword });
        await newUser.save();

        console.log(newUser)

        // res.status(201).json({ message: 'User created successfully', newUser });
        
        // const savedUser: IUser = await newUser.save();

        // res.status(201).json({
        // message: 'User created successfully',
        // user: savedUser,
        // });

        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        };

    res.status(201).json({ message: 'User created successfully', user: userResponse });


    } catch(err:unknown){
        console.error('Create User Error:', err);
        res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : 'Unknown error' });
    }
}

// type SafeUser = {
//   _id: string;
//   name: string;
//   email: string;
// };

type SafeUser = Omit<IUser, 'password'>;

const getUsers = async(_req:Request,res:Response):Promise<void>=>{
    try{
        // const users=await User.find().select('-password');
        const users: SafeUser[] = await User.find().select('-password').lean<SafeUser[]>();
        res.status(200).json(users);
    }
    // catch(err:any){
    //     res.status(500).json({ message: 'Server error', error: err.message });
    // }
    catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


 const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    // const user = await User.findById(id).select('-password');
     const user = await User.findById(id).select('-password').lean<SafeUser | null>();

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown server error');
    res.status(500).json({ message: 'Server error', error: error.message });
  }
//   catch (err: any) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
};


interface UpdateUserBody {
    name?: string; 
    email?: string; 
    password?: string 
}

// // Define allowed fields to update (exclude password here, will handle separately)
// type UpdateUserBody = Partial<Pick<IUser, 'name' | 'email'>> & { password?: string };


const updateUser = async (
  req: Request<{ id: string }, unknown, UpdateUserBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const updates: Partial<IUser> = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // const updatedUser = await User.findByIdAndUpdate(id, updates, {
    //   new: true,
    //   runValidators: true,
    //   select: '-password',
    // });
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,           // Return the updated document
      runValidators: true, // Validate before updating
      select: '-password', // Exclude password from returned document
    }).lean<Omit<IUser, 'password'> | null>();


    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown server error');
    res.status(500).json({ message: 'Server error', error: error.message });
  }

//   catch (err: any) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
};


const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown server error');
    res.status(500).json({ message: 'Server error', error: error.message });
  }
//   catch (err: any) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
};

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
