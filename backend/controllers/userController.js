import bcrypt from bcryptjs;
import dotenv from "dotenv";
import jwt from jsonwebtoken
import User from '../models/userModel';


dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY; // Replace with env var in production

function generateToken(user) {
  return jwt.sign(
    { userid: user.userid, username: user.username, roles: user.roles },
    SECRET_KEY,
  );
}

export const authController = {
  async register(req, res) {
    try {
      const { username, email, password, roles } = req.body;

      // Check if user or email already exists
      const existingUser = await User.findOne({
        where: { 
          [User.sequelize.Op.or]: [{ username }, { email }]
        }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user, default role is ['student'] if roles not given
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        roles: roles && roles.length ? roles : ['student'],
      });

      // Generate token
      const token = generateToken(user);

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          userid: user.userid,
          username: user.username,
          email: user.email,
          roles: user.roles,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Find user by username
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Generate token
      const token = generateToken(user);

      return res.json({
        message: 'Login successful',
        token,
        user: {
          userid: user.userid,
          username: user.username,
          email: user.email,
          roles: user.roles,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  },

  // Middleware example to authenticate JWT token
  authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.user = user;
      next();
    });
  },

  // Example: Get current user profile (after authentication)
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.userid, {
        attributes: ['userid', 'username', 'email', 'roles'],
      });
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ user });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: 'Server error fetching profile' });
    }
  },

  // Optional: user logout can be handled client-side by deleting token
};

