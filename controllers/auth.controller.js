const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ msg: "Email already registered" });

  const user = await User.create({ name, email, password });

  res.status(201).json({ msg: "Registration successful", user: { id: user._id, name: user.name } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  }).json({ msg: "Login successful", user: { id: user._id, name: user.name } });
};

exports.logout = (req, res) => {
  res.clearCookie("token").json({ msg: "Logout successful" });
};
