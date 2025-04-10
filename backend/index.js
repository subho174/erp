const express = require("express");
const connectDB = require("./db");
PORT = process.env.PORT || 9000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/user/admin", adminRouter);

connectDB();

const server = app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is in use. Trying another port...`);
    server.listen(0); // Let OS assign an available port
  } else {
    console.error("Server error:", err);
  }
});
