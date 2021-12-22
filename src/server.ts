import * as http from "http";
import * as socketio from "socket.io";
import expressApp from "./app";
import mongoose from "mongoose";
import EVENT from "./events";
import DAO from "./DAO";

const uri: string = "mongodb+srv://lethanhviet:22102000@cluster0.qrnr2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

interface IUserOnline {
  socketId: string;
  userID: string;
}
class SocketServer {
  private port: string | number;
  private server: http.Server;
  private io: socketio.Server;
  public static onlineUsers: IUserOnline[];

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
      this.joinapp(socket);

      this.disconnect(socket);

      this.send_group_message(socket);

      socket.on(EVENT.send_invidual_message, (params: { id_user: string; message: string }) => {});
    });
  };

  public joinapp = (socket: any) => {
    // Join app
    socket.on(EVENT.join_app, async (id: string) => {
      console.log(id);
      SocketServer.onlineUsers.push({ socketId: socket.id, userID: id });

      // Send list online user to client
      this.io.emit(EVENT.list_online_user, SocketServer.onlineUsers);

      // Client join to all groups that has joined in Database
      const groups = await DAO.groupDAO.getAllGroups(id);

      for (let group of groups) {
        socket.join(group._id.valueOf().toString());
      }
    });
  };

  public disconnect = (socket: any) => {
    socket.on(EVENT.disconnect, () => {
      // Remove user from online list
      SocketServer.onlineUsers = SocketServer.onlineUsers.filter((user) => user.socketId !== socket.id);

      // Send list online user to client
      this.io.emit(EVENT.list_online_user, SocketServer.onlineUsers);
    });
  };

  public send_group_message = async (socket: any) => {
    socket.on(EVENT.send_message, async (params: { id_user: string; id_group: string; message: string }) => {
      const user = await DAO.userDAO.getUserById(params.id_user);

      if (user) {
        // Send message to all user
        socket.to(params.id_group).emit(EVENT.recieve_message, {
          user_id: user._id.valueOf().toString(),
          name: user.name,
          message: params.message,
          isNotification: false,
        });
      }
    });
  };
}

const socketServer = new SocketServer();

export default socketServer;
