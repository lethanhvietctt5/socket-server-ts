import express from "express";
import cors from "cors";
import * as http from "http";
import * as socketio from "socket.io";

export class ExpressApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(cors());
  }

  private configureRoutes(): void {
    this.app.get("/auth", (req, res) => {
      
    });
  }
}

const expressApp = new ExpressApp();

export default expressApp;
