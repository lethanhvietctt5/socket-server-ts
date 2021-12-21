import * as http from "http";
import * as socketio from "socket.io";
import expressApp from "./app";
import mongoose from "mongoose";
import EVENT from "./events";

const uri: string = "mongodb+srv://lethanhviet:22102000@cluster0.qrnr2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

class SocketServer {
  private port: string | number;
  private server: http.Server;
  private io: socketio.Server;
  public static onlineUsers: string[];

  constructor() {
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(expressApp.app);
    this.io = new socketio.Server(this.server, {
      cors: {
        origin: "*",
      },
    });
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  public connection = () => {
    // User connect to server
    this.io.on(EVENT.connection, (socket) => {
      // Join app
      socket.on(EVENT.join_app, (id: string) => {
        console.log(id);
        SocketServer.onlineUsers.push(id);

        // Send list online user to client
        this.io.emit(EVENT.list_online_user, SocketServer.onlineUsers);
      });
    });
  };
}

const socketServer = new SocketServer();

export default socketServer;
