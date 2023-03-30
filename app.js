const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const http = require("http");
const express = require("express");
require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/users", userRouter);

connectDB();

app.listen(5000, console.log("app listening on 5000"));
