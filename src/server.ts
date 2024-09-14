import app from "./app";
import mongoose from "mongoose";
import { env } from "./utils";

const port = env.PORT || 5000;
const connectionUrl = env.MONGO_CONNECTION_STRING;

mongoose
  .connect(connectionUrl)
  .then(() => {
    console.log("DB Connected!");

    app.listen(port, () => {
      console.log(`Server running on port: ${port}.`);
    });
  })
  .catch(console.error);
