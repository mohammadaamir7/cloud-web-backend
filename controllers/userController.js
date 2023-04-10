const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const userFilePath = path.join(__dirname, '../emailtemplates/userEmail.hbs');
const adminFilePath = path.join(__dirname, '../emailtemplates/adminEmail.hbs');
require('dotenv').config();


let userTemplate = fs.readFileSync(
  userFilePath,
  "utf-8"
);
let adminTemplate = fs.readFileSync(
  adminFilePath,
  "utf-8"
);

let compiledUserTemplate = handlebars.compile(userTemplate);
let compiledAdminTemplate = handlebars.compile(adminTemplate);

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.APP_PSW,
  },
});


// @desc    Register a new admin user
// @route   POST /api/users
// @access  Public
const adminRegister = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  const user = await User.create({ email, password, firstName, lastName, role: "admin" });
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid user data");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  const user = await User.create({ email, password, firstName, lastName });
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: user.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Send emails to clients and admin
// @route   POST /api/users
// @access  Public
const sendEmail = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, city, phone } = req.body;
  try {
    let userHtml = compiledUserTemplate({ email, firstName, lastName, city, phone });
    let adminHtml = compiledAdminTemplate({ email, firstName, lastName, city, phone });

    await transporter.sendMail({
      from: process.env.COMPANY_EMAIL,
      to: `${email}`,
      subject: "Cyber Security LLC",
      html: userHtml,
    });

    await transporter.sendMail({
      from: process.env.COMPANY_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Cyber Security LLC",
      html: adminHtml,
    });

    res.send().status(200);
  } catch (err) {
    res.status(404);
    throw new Error("Email not sent");
  }
});

module.exports = {
  adminRegister,
  register,
  sendEmail,
  login,
  update,
  getUserById,
  getUserProfile,
};
