import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router/routes.js";
import contactRouter from "./router/contact.routes.js";

dotenv.config({
  path: "./.env",
});

const DB_NAME = "whisper";

const app = express();
const PORT = process.env.PORT || 8080;
const databaseURL = process.env.DATABASE_URI;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", router);
app.use("/api/contacts", contactRouter);

// app.get(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${databaseURL}/${DB_NAME}`
    );
    console.log(
      `\n MonogoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
    console.log(`http://localhost:${PORT}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed", error);
  });

app.get("/", (req, res) => {
  res.send("Hello!");
});
