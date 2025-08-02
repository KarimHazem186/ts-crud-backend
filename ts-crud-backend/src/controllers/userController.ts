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


