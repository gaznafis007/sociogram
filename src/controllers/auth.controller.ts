import { Request, Response } from 'express';
import { User } from '../models/User';
import { passwordService } from '../services/password.service';
import { authService } from '../services/auth.service';
import {
  createUserSchema,
  loginSchema,
  updateProfileSchema,
  CreateUserInput,
  LoginInput,
  UpdateProfileInput,
} from '../utils/validators';
import { ConflictError, NotFoundError, AuthenticationError } from '../utils/errors';
import { ResponseHandler } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = createUserSchema.parse(req.body) as CreateUserInput;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: body.email }, { username: body.username }],
  });

  if (existingUser) {
    throw new ConflictError('User with this email or username already exists');
  }

  // Hash password
  const hashedPassword = await passwordService.hashPassword(body.password);

  // Create user
  const user = await User.create({
    username: body.username,
    email: body.email,
    password: hashedPassword,
    fullName: body.fullName,
  });

  // Generate token
  const token = authService.generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  ResponseHandler.created(
    res,
    {
      user: user.toJSON(),
      token,
    },
    'User created successfully'
  );
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = loginSchema.parse(req.body) as LoginInput;

  // Find user and explicitly select password
  const user = await User.findOne({ email: body.email }).select('+password');

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await passwordService.comparePasswords(body.password, user.password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate token
  const token = authService.generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  ResponseHandler.success(
    res,
    {
      user: user.toJSON(),
      token,
    },
    'Login successful'
  );
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new NotFoundError('User');
  }

  ResponseHandler.success(res, user.toJSON(), 'Profile retrieved successfully');
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const body = updateProfileSchema.parse(req.body) as UpdateProfileInput;

  const user = await User.findByIdAndUpdate(req.user.userId, body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  ResponseHandler.success(res, user.toJSON(), 'Profile updated successfully');
});

export const updateDeviceToken = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const { deviceToken } = req.body;

  if (!deviceToken || typeof deviceToken !== 'string') {
    throw new Error('Device token is required');
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { deviceToken },
    { new: true }
  );

  if (!user) {
    throw new NotFoundError('User');
  }

  ResponseHandler.success(res, user.toJSON(), 'Device token updated successfully');
});

export const getUserProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError('User');
  }

  ResponseHandler.success(res, user.toJSON(), 'User profile retrieved successfully');
});

export const searchUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { query, limit = 10, page = 1 } = req.query;

  if (!query || typeof query !== 'string') {
    throw new Error('Search query is required');
  }

  const limitNum = Math.min(parseInt(limit as string) || 10, 50);
  const pageNum = Math.max(parseInt(page as string) || 1, 1);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find({
    $or: [
      { username: { $regex: query, $options: 'i' } },
      { fullName: { $regex: query, $options: 'i' } },
    ],
  })
    .select('-password')
    .limit(limitNum)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments({
    $or: [
      { username: { $regex: query, $options: 'i' } },
      { fullName: { $regex: query, $options: 'i' } },
    ],
  });

  ResponseHandler.paginated(res, users.map((u) => u.toJSON()), total, pageNum, limitNum, 'Users found');
});
