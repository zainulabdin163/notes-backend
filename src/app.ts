/* 
- maxAge: 60 * 60 * 1000 -> Cookie will be valid for 1 hour only.
- rolling: It will make sure that if user is using the site actively more than 1 hour they'll be still be able to use it as cookie will refresh automatically every 1 hour.
- store: Store is where our session data will be stored, if we pass nothing it will store the session in memory and if server restarts then all session data will be deleted so for production it isn't good so we will store our session data in our mongo database.
*/

import "dotenv/config";
import expess, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import { env } from "./utils";
import { requiresAuth } from "./middlewares";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRoutes from "./routes/users";
import notesRoutes from "./routes/notes";

const app = expess();

app.use(morgan("dev"));
app.use(expess.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notes", requiresAuth, notesRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "Endpoint not found."));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  let errorMessage = "An unknown error occurred";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

export default app;
