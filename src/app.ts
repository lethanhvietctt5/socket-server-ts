import { IUser } from "./types/user";
import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

export class ExpressApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(cors());
  }

  private configureRoutes(): void {
    this.app.get("/auth", (req: Request, res: Response) => {
      const access_token: string | undefined =
        req.headers["x-auth-token"]?.toString();

      if (typeof access_token === "undefined") {
        return res.status(401).json({
          message: "No access token provided",
        });
      }

      if (typeof access_token == "string") {
        const decode = jwt.verify(access_token, "secret");
        const { email } = decode as IUser;
      }
    });
  }
}

const expressApp = new ExpressApp();

export default expressApp;
