import { Document } from 'mongoose';

// Google User Interface
export interface IGoogleUser extends Document {
  googleId: string;
  username: string;
  email?: string;
  profilePicture?: string;
  lastLogin: Date;
  isGoogleUser: boolean;
}

// Extended Express Request interface
declare global {
  namespace Express {
    interface User {
      _id: string;
      googleId: string;
      username: string;
      email?: string;
      profilePicture?: string;
    }
  }
}

// Google Profile interface
export interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
} 