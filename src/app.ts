import { IUser } from "./types/user";
import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import router from "./routes";

export class ExpressApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.app.use(router);
  }
}

const expressApp = new ExpressApp();

export default expressApp;
