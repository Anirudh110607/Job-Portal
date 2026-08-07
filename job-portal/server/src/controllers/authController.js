const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const mockStore = require('../utils/mockStore');
const { getDbState } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'hirepulse_super_secret_jwt_key_2026_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'hirepulse_super_secret_refresh_key_2026';

const generateTokens = (userId, role) => {
  const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ id: userId, role }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { token, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const { useMock } = getDbState();

    if (useMock) {
      const existing = mockStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = mockStore.addUser({
        name,
        email,
        password: hashedPassword,
        role: role || 'candidate'
      });

      if (role === 'recruiter') {
        mockStore.addCompany({
          name: companyName || `${name}'s Company`,
          recruiterId: newUser._id,
          tagline: 'Building the future of tech',
          about: 'We are an innovative team dedicated to crafting world-class products.',
          industry: 'Technology',
          location: 'San Francisco, CA'
        });
      }

      const tokens = generateTokens(newUser._id, newUser.role);
      const userSansPass = { ...newUser };
      delete userSansPass.password;

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        user: userSansPass
      });
    }

    // Live MongoDB mode
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'candidate'
    });

    if (role === 'recruiter') {
      await Company.create({
        name: companyName || `${name}'s Company`,
        recruiterId: user._id,
        tagline: 'Building the future of tech',
        about: 'We are an innovative team dedicated to crafting world-class products.',
        industry: 'Technology',
        location: 'San Francisco, CA'
      });
    }

    const tokens = generateTokens(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const { useMock } = getDbState();

    if (useMock) {
      const user = mockStore.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (user.status === 'banned') {
        return res.status(403).json({ success: false, message: 'Account is suspended' });
      }

      const tokens = generateTokens(user._id, user.role);
      const userSansPass = { ...user };
      delete userSansPass.password;

      return res.json({
        success: true,
        message: 'Logged in successfully',
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        user: userSansPass
      });
    }

    // Live MongoDB mode
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Account is suspended' });
    }

    const tokens = generateTokens(user._id, user.role);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        skills: user.skills,
        bio: user.bio,
        location: user.location,
        resumeUrl: user.resumeUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, phone, location, availability, skills, portfolio, linkedin, github, experience, education } = req.body;
    const { useMock } = getDbState();

    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (availability) updates.availability = availability;
    if (skills) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (portfolio !== undefined) updates.portfolio = portfolio;
    if (linkedin !== undefined) updates.linkedin = linkedin;
    if (github !== undefined) updates.github = github;
    if (experience) updates.experience = experience;
    if (education) updates.education = education;

    if (req.file) {
      // Mock base64 URL or file path simulation
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      if (req.file.mimetype.includes('pdf')) {
        updates.resumeUrl = base64;
      } else {
        updates.avatar = base64;
      }
    }

    if (useMock) {
      const updated = mockStore.updateUser(req.user._id, updates);
      return res.json({ success: true, message: 'Profile updated successfully', user: updated });
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    return res.json({ success: true, message: 'Profile updated successfully', user: updated });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Simulated OTP / email notification
  return res.json({
    success: true,
    message: `Password reset instructions sent to ${email}. (Demo OTP: 482910)`
  });
};
