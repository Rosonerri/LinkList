console.clear()
import express, { Application } from "express";
import { mainApp } from "./mainApp";
import "./utils/dbConfig";
import cors from "cors";

const app: Application = express();
app.use(cors());
app.use(express.json());
const port: number = 2255;

mainApp(app);

const server = app.listen(port, () => {
  console.log();
  console.log("ready to rock on Port", port);
});

process.on("uncaughtException", (error: Error | any) => {
  console.log("uncaughtException: ", error);

  process.exit(1);
});
process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection: ", reason);

  server.close(() => {
    process.exit(1);
  });
});
