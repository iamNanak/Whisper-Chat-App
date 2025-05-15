import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });

  return token;
};

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).send("Email and Password is required");
    }

    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    console.log(user.id);
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required!!");
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User doesn't exist!!");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Incorrect Password");
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    // console.log(error.message);
    return res.status(400).send("Login Failed");
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    res.status(200).send("Logout Successfully");
  } catch ({ error }) {
    res.status(500).send("Internal Server Error");
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    // console.log(req.userId);
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send("User not found");

    return res.status(200).json({
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    // console.log({ error });
    return res.status(500).send("Problem in getting User Info");
  }
};

const updateInfo = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).send("FirstName, LastName and Color is requried.");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Profile can't update");
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required.");
    }

    const date = Date.now();

    let fileName = "uploads/profiles/" + date + req.file.originalname;

    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log("uploading profile image:", error);
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    console.log(userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    unlinkSync(user.image);

    user.image = null;

    await user.save();

    return res.status(200).send("Profile Image Deleted Successfully");
  } catch (error) {
    console.log("delete profile image:", error);
  }
};

export {
  signup,
  login,
  logout,
  getUserInfo,
  updateInfo,
  uploadProfileImage,
  deleteProfileImage,
};
