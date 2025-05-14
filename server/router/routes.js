import { Router } from "express";

import {
  signup,
  login,
  getUserInfo,
  updateInfo,
  uploadProfileImage,
  deleteProfileImage,
} from "../controllers/user.controllers.js";
import { verfiyToken } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads/profiles/" });

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-info", verfiyToken, getUserInfo);

router.post("/update-info", verfiyToken, updateInfo);
router.post(
  "/upload-profile-image",
  verfiyToken,
  upload.single("profile-image"),
  uploadProfileImage
);

router.delete("/remove-profile-image", verfiyToken, deleteProfileImage);
export default router;
