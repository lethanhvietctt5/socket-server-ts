import * as http from "http";
import * as socketio from "socket.io";
import expressApp from "./app";
import mongoose from "mongoose";

const uri: string =
  "mongodb+srv://lethanhviet:22102000@cluster0.qrnr2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

class SocketServer {
  private port: string | number;
  private server: http.Server;
  private io: socketio.Server;

  constructor() {
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(expressApp.app);
    this.io = new socketio.Server(this.server);
  }

  public listen = () => {
    mongoose
      .connect(uri)
      .then(async () => {
        console.log("Connected to MongoDB");

        this.server.listen(this.port, () => {
          console.log(`Server listening on port http://localhost:${this.port}`);
        });

        this.io.on("connection", (...params) => {
          console.log(params);
        });

        // userDA.getUserByEmail("lethanhviet7c@gmail.com").then((user) => {
        //   console.log(user);
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

const socketServer = new SocketServer();

export default socketServer;
