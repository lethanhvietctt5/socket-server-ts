import * as http from "http";
import * as socketio from "socket.io";
import expressApp from "./app";

class SocketServer {
  private port: string | number;
  private server: http.Server;
  private io: socketio.Server;

  constructor() {
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(expressApp.app);
    this.io = new socketio.Server(this.server);
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port http://localhost:${this.port}`);
    });

    this.io.on("connection", (...params) => {
      console.log(params);
    });
  }
}

const socketServer = new SocketServer();

export default socketServer;
