/* 
- throw -> No need for a return statement when we use throw coz it will automatically move to catch block. 
- sendStatus -> We will use sendStatus when deleting a document coz it has no body or response. 
*/

import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { TCreateUpdateNoteBody, TUpdateNoteParams } from "../@types";
import { assertIsDefined } from "../utils";
import createHttpError from "http-errors";
import NotesModel from "../models/note";

const getNotes: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    assertIsDefined(userId);

    const notes = await NotesModel.find({ userId }).exec();

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

const getNote: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  const id = req.params.id;

  try {
    assertIsDefined(userId);

    if (!isValidObjectId(id)) {
      throw createHttpError(400, "Invalid note ID.");
    }

    const note = await NotesModel.findById(id).exec();

    if (!note) {
      throw createHttpError(404, "Note not found.");
    }

    if (!note.userId.equals(userId)) {
      throw createHttpError(401, "You cannot access this note.");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

const createNote: RequestHandler<
  unknown,
  unknown,
  TCreateUpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const userId = req.session.userId;
  const title = req.body.title;
  const text = req.body.text;

  try {
    assertIsDefined(userId);

    if (!title) {
      throw createHttpError(400, "Note must have a title.");
    }

    const newNote = await NotesModel.create({
      userId,
      title,
      text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

const updateNote: RequestHandler<
  TUpdateNoteParams,
  unknown,
  TCreateUpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const userId = req.session.userId;
  const id = req.params.id;
  const newTitle = req.body.title;
  const newText = req.body.text;

  try {
    assertIsDefined(userId);

    if (!isValidObjectId(id)) {
      throw createHttpError(400, "Invalid note ID.");
    }

    const note = await NotesModel.findById(id).exec();

    if (!note) {
      throw createHttpError(404, "Note not found.");
    }

    if (!note.userId.equals(userId)) {
      throw createHttpError(401, "You cannot access this note.");
    }

    if (newTitle && newText) {
      note.title = newTitle;
      note.text = newText;

      const updatedNote = await note.save();

      res.status(200).json(updatedNote);
    }

    if (newTitle) {
      note.title = newTitle;

      const updatedNote = await note.save();

      res.status(200).json(updatedNote);
    }

    if (newText) {
      note.text = newText;

      const updatedNote = await note.save();

      res.status(200).json(updatedNote);
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

const deleteNote: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  const id = req.params.id;

  try {
    assertIsDefined(userId);

    if (!isValidObjectId(id)) {
      throw createHttpError(400, "Invalid note ID.");
    }

    const note = await NotesModel.findById(id).exec();

    if (!note) {
      throw createHttpError(404, "Note not found.");
    }

    if (!note.userId.equals(userId)) {
      throw createHttpError(401, "You cannot access this note.");
    }

    await note.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export { getNotes, getNote, createNote, updateNote, deleteNote };
