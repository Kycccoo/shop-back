import { Router } from "express";
import * as auth from "../middlewares/auth.js";
import {
  create,
  getMy,
  addUrl,
  //   getAll,
  edit,
  //   get,
  //   getId,
} from "../controllers/url-controllers.js";
import upload from "../middlewares/upload.js";
import admin from "../middlewares/admin.js";

const router = Router();

router.post("/", auth.jwt, create);
router.get("/me", auth.jwt, getMy);
router.post("/:id/urls", auth.jwt, addUrl);
router.patch("/:id/:uid", auth.jwt, admin, edit);
// router.get("/", get);
// router.get("/:id", getId);

export default router;
