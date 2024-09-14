import express from "express";
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from "../controllers/notes";

const router = express.Router();

router.get("/", getNotes);

router.get("/:id", getNote);

router.post("/", createNote);

router.patch("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router;
