import { Router } from "express";
import {
  create,
  login,
  logout,
  extend,
  getProfile,
  editUrl,
  getUrl,
} from "../controllers/user-controllers.js";
import * as auth from "../middlewares/auth.js";

const router = Router();

router.post("/", create);
router.post("/login", auth.login, login);
router.delete("/logout", auth.jwt, logout);
router.patch("/extend", auth.jwt, extend);
router.get("/me", auth.jwt, getProfile);
router.patch("/url", auth.jwt, editUrl);
router.get("/url", auth.jwt, getUrl);

export default router;
