import { Application, Request, Response } from "express";

import { v4 as uuid } from "uuid";
import moment from "moment";

import path from "path";
import fs from "fs";
import { userModel } from "./utils/userModel";
import { client, db } from "./utils/dbConfig";
import { ObjectId } from "mongodb";

import lodash from "lodash";

let database: Array<{}> = [];

export const mainApp = (app: Application) => {
  app.get("/read-data", (req: Request, res: Response): any => {
    try {
      let myPath = path.join(__dirname, "./database.json");

      fs.readFile(myPath, (err, data) => {
        if (err) {
          return err;
        } else {
          let readableData = JSON.parse(Buffer.from(data).toString());

          return res.status(200).json({
            message: "reading data",
            data: readableData,
          });
        }
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error reading data",
      });
    }
  });

  app.post("/create-data", (req: Request, res: Response): Response => {
    try {
      const { name, email } = req.body;

      const data = {
        id: uuid(),
        name,
        email,
        createdAt: moment(new Date().getTime()).format("LTS"),
      };

      database.push(data);

      let myPath = path.join(__dirname, "./database.json");

      fs.writeFile(myPath, JSON.stringify(database), () => {
        console.log(`Data saved`);
      });

      return res.status(200).json({
        message: "creating data",
        data,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error creating data",
      });
    }
  });

  app.patch("/update-data/:userID", (req: Request, res: Response): Response => {
    try {
      const { name } = req.body;
      const { userID } = req.params;

      const findUser: any = database.find((el: any) => {
        return el.id === userID;
      });

      findUser.name = name;

      return res.status(200).json({
        message: "updating data",
        data: findUser,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error updating data",
      });
    }
  });

  app.delete(
    "/delete-data/:userID",
    (req: Request, res: Response): Response => {
      try {
        const { userID } = req.params;

        const findUser: any = database.find((el: any) => {
          return el.id === userID;
        });

        const removeUser: any = database.filter((el: any) => {
          return el.id !== userID;
        });

        database = removeUser;

        return res.status(201).json({
          message: `${findUser.name} has been removed successfully`,
        });
      } catch (error) {
        return res.status(404).json({
          message: "Error deleting data",
        });
      }
    }
  );

  app.post("/create", async (req: Request, res: Response) => {
    try {
      await client.connect();
      const { name, score, subject } = req.body;

      const data = new userModel(name, score, subject);

      await db.insertOne(data);

      return res.status(201).json({
        message: "user created",
        data,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "Error",
        data: error.message,
      });
    }
  });

  app.get("/read", async (req: Request, res: Response) => {
    try {
      await client.connect();
      const data = await db.find({}, {}).toArray();

      return res.status(200).json({
        message: "user read",
        data,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "Error",
        data: error.message,
      });
    }
  });

  app.get("/read-one/:userID", async (req: Request, res: Response) => {
    try {
      await client.connect();
      const { userID } = req.params;

      console.log(new ObjectId(userID));

      const data = await db.findOne({ _id: new ObjectId(userID) });

      return res.status(200).json({
        message: "user read",
        data,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "Error",
        data: error.message,
      });
    }
  });

  app.patch("/update-one/:userID", async (req: Request, res: Response) => {
    try {
      await client.connect();
      const { score, name } = req.body;
      const { userID } = req.params;

      console.log(new ObjectId(userID));

      const data = await db.updateOne(
        { _id: new ObjectId(userID) },
        { $set: { score, name } }
      );

      return res.status(200).json({
        message: "user read",
        data,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "Error",
        data: error.message,
      });
    }
  });

  app.patch("/update-many", async (req: Request, res: Response) => {
    try {
      await client.connect();

      const data = await db.updateMany({}, { $set: { fullTime: true } });

      return res.status(200).json({
        message: "user read",
        data,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "Error",
        data: error.message,
      });
    }
  });

  app.post("/data", async (req: Request, res: Response) => {
    try {
      const { data: userData } = req.body;

      const showPath = path.join(__dirname, "data", "./database.json");

      fs.readFile(showPath, (err, data) => {
        if (err) {
          return err;
        } else {
          const dataRead = JSON.parse(Buffer.from(data).toString());

          if (lodash.some(dataRead, userData)) {
            console.log("not Good to go...!");
            res.status(200).json({
              message: "Read",
              data: dataRead,
            });
          } else {
            console.log("Good to go...!");
            dataRead.push(userData);

            fs.writeFile(showPath, JSON.stringify(dataRead), "utf-8", () => {
              console.log("done");
            });

            res.status(200).json({
              message: "Read",
              data: dataRead,
            });
          }
        }
      });
    } catch (error) {
      res.status(404).json({
        message: "Error",
      });
    }
  });

  app.get("/reading", async (req: Request, res: Response) => {
    try {
      const { data: userData } = req.body;

      const showPath = path.join(__dirname, "data", "./database.json");

      fs.readFile(showPath, (err, data) => {
        if (err) {
          return err;
        } else {
          const dataRead = JSON.parse(Buffer.from(data).toString());

          res.status(200).json({
            message: "Read",
            data: dataRead,
          });
        }
      });
    } catch (error) {
      res.status(404).json({
        message: "Error",
      });
    }
  });
};
