import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    const usernameExists = await User.findOne({ username: username.trim() });
    if (usernameExists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const emailExists = await User.findOne({ email: email.trim().toLowerCase() });
    if (emailExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'user'
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Identifier and password are required'
      });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier.trim() },
        { email: identifier.trim().toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);

    if (!matches) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    req.session.userId = user._id.toString();
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.loginTime = new Date().toISOString();

    return res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while loading profile',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: 'Logout failed'
      });
    }

    res.clearCookie('securedocs.sid');

    return res.status(200).json({
      message: 'Logout successful'
    });
  });
};

export const getSessionStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(200).json({
        authenticated: false
      });
    }

    const user = await User.findById(req.session.userId).select('-passwordHash');

    if (!user) {
      return res.status(200).json({
        authenticated: false
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error checking session',
      error: error.message
    });
  }
};