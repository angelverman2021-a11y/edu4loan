import { User, IUser } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    phone?: string;
    admissionYear?: number;
    degreeProgram?: string;
    savedSchemeIds: string[];
    createdAt: Date;
  };
}

const sanitizeUser = (user: IUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  admissionYear: user.admissionYear,
  degreeProgram: user.degreeProgram,
  savedSchemeIds: user.savedSchemeIds,
  createdAt: user.createdAt,
});

export const registerUser = async (data: RegisterInput): Promise<AuthResult> => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const error: any = new Error('An account with this email address already exists.');
    error.statusCode = 409;
    error.code = 'USER_ALREADY_EXISTS';
    throw error;
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash: hashedPassword,
    role: 'student', // Default role is strictly student
    phone: data.phone,
    admissionYear: data.admissionYear,
    degreeProgram: data.degreeProgram,
    savedSchemeIds: [],
  });

  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const loginUser = async (data: LoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email: data.email }).select('+passwordHash');
  if (!user) {
    const error: any = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await comparePassword(data.password, user.passwordHash);
  if (!isMatch) {
    const error: any = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    const error: any = new Error('User account not found.');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return sanitizeUser(user);
};
