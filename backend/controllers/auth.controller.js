import * as authService from "../services/auth.service.js";

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const result = await authService.registerUser({
      username,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user (protected route)
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.userId);

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
