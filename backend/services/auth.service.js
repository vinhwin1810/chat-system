import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { JWT_SECRET } from "../config/config.js";

/**
 * Register a new user
 */
export const registerUser = async ({ username, email, password }) => {
  // Validate input
  if (!username || !email || !password) {
    throw {
      statusCode: 400,
      message: "All fields (username, email, password) are required",
    };
  }

  // Validate password length
  if (password.length < 6) {
    throw {
      statusCode: 400,
      message: "Password must be at least 6 characters long",
    };
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw {
      statusCode: 409,
      message:
        existingUser.email === email
          ? "Email already registered"
          : "Username already taken",
    };
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = generateToken(user);

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
};

/**
 * Login user
 */
export const loginUser = async ({ email, password }) => {
  // Validate input
  if (!email || !password) {
    throw {
      statusCode: 400,
      message: "Email and password are required",
    };
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw {
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw {
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  // Generate JWT token
  const token = generateToken(user);

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw {
      statusCode: 404,
      message: "User not found",
    };
  }

  return user;
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};
