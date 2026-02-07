import { Schema, model, Document } from 'mongoose';

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio?: string;
  profileImage?: string;
  deviceToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    deviceToken: {
      type: String,
      sparse: true, // Allow null values but maintain uniqueness for non-null
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Add method to check password match
userSchema.methods.matchPassword = async function (this: IUserDocument, password: string): Promise<boolean> {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(password, this.password);
};

// Remove password field when converting to JSON
userSchema.methods.toJSON = function (this: IUserDocument) {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model<IUserDocument>('User', userSchema);
