import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import User from "../models/userModel";
import { generateToken } from "../utils/generateToken";
import { deleteMediaFromCloudinary } from "../utils/cloudinary";

export const register = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Field must not be empty" });
    }

    // Check if user or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user, default role is ['student'] if roles not given
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roles: roles && roles.length ? roles : ["student"],
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Field must not be empty" });
    }
    // Find user by username
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate token
    generateToken(res, user, `Welcome ${user.username}`);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to Logout" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userid = req.userid;
    const user = await User.findById(userid).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }
    return res.statuts(200).json({
      success: true,
      message: "Successfully fetched UserProfile",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // extract public id of the old image from the url is it exists;
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
      deleteMediaFromCloudinary(publicId);
    }

    // upload new photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    const updatedData = { name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
