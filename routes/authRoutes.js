import express from "express";
import { register, login, updateUser } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many request from this IP address, please try again after 15min'
})

router.route('/register').post(apiLimiter, register);
router.route('/login').post(login);
router.route('/updateUser').patch(auth, updateUser);

export default router;