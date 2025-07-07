require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const connectDB = require("./config/db");
const { default: helmet } = require("helmet");
const { default: rateLimit } = require("express-rate-limit");

const app = express();
connectDB();

////////////////////////////////////////////////////////
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
////////////////////////////////////////////////////////

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running : http://localhost:${PORT}`));
