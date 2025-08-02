import { RequestHandler } from 'express';
import User, { IUser } from '../models/user.model.js';
import createHttpError from 'http-errors';

interface CreateUserBody { name: string; email: string; password: string }
interface UpdateUserBody { name?: string; email?: string; password?: string }

export const createUser: RequestHandler<unknown, unknown, CreateUserBody> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw createHttpError(400, 'Missing fields');
    const exists = await User.findOne({ email });
    if (exists) throw createHttpError(409, 'Email already in use');
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users: IUser[] = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) throw createHttpError(404, 'User not found');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser: RequestHandler<{ id: string }, unknown, UpdateUserBody> = async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) throw createHttpError(404, 'User not found');
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteUser: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) throw createHttpError(404, 'User not found');
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};


/*
export const createUser: RequestHandler<unknown, unknown, CreateUserBody> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createHttpError(400, 'Name, email and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'User already exists');
    }

    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users: IUser[] = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler<{ id: string }, unknown, UpdateUserBody> = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

*/

/*
// POST /api/users — Create User
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json(user);
});

// GET /api/users — Get all users
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
});

// GET /api/users/:id — Get user by id
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// PUT /api/users/:id — Update user
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, password } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password; // will be hashed by pre-save hook

  const updatedUser = await user.save();
  res.json(updatedUser);
});

// DELETE /api/users/:id — Delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.remove();
  res.json({ message: 'User deleted successfully' });
});

*/