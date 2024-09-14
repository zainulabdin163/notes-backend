import express from "express";
import {
  getAuthenticatedUser,
  signIn,
  signOut,
  signUp,
} from "../controllers/users";
import { requiresAuth } from "../middlewares";

const router = express.Router();

router.get("/", requiresAuth, getAuthenticatedUser);

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);

export default router;
