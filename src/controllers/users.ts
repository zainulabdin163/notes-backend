import { RequestHandler } from "express";
import { TSignUpBody, TSignInBody } from "../@types";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import UserModel from "../models/user";

const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const signUp: RequestHandler<unknown, unknown, TSignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters missing.");
    }

    const existingUsername = await UserModel.findOne({ username });

    if (existingUsername) {
      throw createHttpError(
        409,
        "Username is already taken. Please choose a different one or log in instead."
      );
    }

    const existingEmail = await UserModel.findOne({ email });

    if (existingEmail) {
      throw createHttpError(
        409,
        "A user with this email address already exists. Please log in instead."
      );
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const signIn: RequestHandler<unknown, unknown, TSignInBody, unknown> = async (
  req,
  res,
  next
) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing.");
    }

    const user = await UserModel.findOne({ username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials.");
    }

    req.session.userId = user._id;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const signOut: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};

export { getAuthenticatedUser, signUp, signIn, signOut };
