import { IContactJSON } from "./types/contact";
import { IMainMessageJSON } from "./types/message";
import * as http from "http";
import * as socketio from "socket.io";
import expressApp from "./app";
import mongoose from "mongoose";
import EVENT from "./events";
import DAO from "./DAO";
import IMessageGroup from "./types/message_group";
import IGroup from "./types/group";
import IGroupMember from "./types/group_member";

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

        this.connection();
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
      this.sendAndReceiveMessage(socket);
      this.addNewMember(socket);
      this.joinGroup(socket);
      this.leaveGroup(socket);
      this.addContact(socket);
      this.removeContact(socket);
      this.acceptContact(socket);
    });
  };

  public joinapp = (socket: any) => {
    // Khi người dùng đăng nhập thành công
    socket.on(EVENT.join_app, async (id: string) => {
      console.log(id);
      // Thêm user vào danh sách các user đang online
      SocketServer.onlineUsers.push({ socketId: socket.id, userID: id });

      // Cập nhật danh sách user online mới và gửi đến các client khác
      this.io.emit(EVENT.list_online_user, SocketServer.onlineUsers);

      // Cho client join vào tất cả các group họ đang tham gia để nhận thông báo khi có tin nhắn nhóm
      const groups = await DAO.groupDAO.getAllGroups(id);

      for (let group of groups) {
        socket.join(group.id);
      }
    });
  };

  public disconnect = (socket: any) => {
    socket.on(EVENT.disconnect, () => {
      // Loại bỏ khỏi danh sách user đang online
      SocketServer.onlineUsers = SocketServer.onlineUsers.filter((user) => user.socketId !== socket.id);

      // Cập nhật danh sách user đang online mới và gửi đến các client khác
      this.io.emit(EVENT.list_online_user, SocketServer.onlineUsers);
    });
  };

  public sendAndReceiveMessage = (socket: any) => {
    // Client gửi tin nhắn đi
    socket.on(EVENT.send_message, (message: IMainMessageJSON) => {
      // Tin nhắn group
      if (message.group) {
        // Gửi đến group
        socket.to(message.group._id).emit(EVENT.recieve_message, message);
      }
      // Tin nhắn cá nhân
      else if (message.receiver) {
        const user_online = SocketServer.onlineUsers.find((user) => user.userID === message.receiver?._id);
        if (user_online) {
          socket.to(user_online.socketId).emit(EVENT.recieve_message, message);
        }
      }
    });
  };

  public addNewMember = (socket: any) => {
    // Thêm một thành viên mới vào group
    socket.on(EVENT.add_new_member, async (params: { id_new_member: string; id_user_added: string; id_group: string }) => {
      // Xác định người thêm vào, group và thành viên mới
      const sender = await DAO.userDAO.getUserById(params.id_user_added);
      const group = await DAO.groupDAO.getGroupById(params.id_group);
      const new_member = await DAO.userDAO.getUserById(params.id_new_member);
      if (sender && group && new_member) {
        // Tạo tin nhắn nhóm với nội dung thông báo có người mới được thêm vào group
        const content: string = `${sender} has add ${new_member.name} to group.`;
        const message: IMessageGroup | null = await DAO.messageDAO.addGroupMessage(group.id, sender.id, content, "text", true);
        const groupAdded: IGroup | null = await DAO.groupDAO.addNewMember(params.id_new_member, params.id_group, params.id_user_added);

        if (message && groupAdded) {
          let notification: IMainMessageJSON | null = await DAO.messageDAO.toJSON(message);
          const groupMember = await DAO.groupDAO.getYourDetails(params.id_new_member, params.id_group);
          const groupMemberJSON = await DAO.groupDAO.toJSON(groupMember);
          if (notification && groupMemberJSON) {
            // Gửi tin nhắn thông báo tới các client trong group
            socket.to(message.id_group).emit(EVENT.recieve_message, notification);
            const client_online = SocketServer.onlineUsers.find((user) => user.userID === params.id_new_member);
            if (client_online) {
              // Gửi thông báo đến người dùng mới được thêm vào group
              socket.to(client_online.socketId).emit(EVENT.is_added_to_group, groupMemberJSON);
            }
          }
        }
      }
    });
  };

  public joinGroup = (socket: any) => {
    socket.on(EVENT.join_group, (id_group: string) => {
      socket.join(id_group);
    });
  };

  public leaveGroup = (socket: any) => {
    socket.on(EVENT.leave_group, async (params: { id_user_leave: string; id_group: string }) => {
      // Tạo tin nhắn với nội dung thông báo có thành viên rời nhóm, người rời nhóm chính là sender của tin nhắn
      const sender = await DAO.userDAO.getUserById(params.id_user_leave);
      const group = await DAO.groupDAO.getGroupById(params.id_group);
      if (sender && group) {
        const content: string = `${sender.name} has leave group.`;
        const message: IMessageGroup | null = await DAO.messageDAO.addGroupMessage(group.id, sender.id, content, "text", true);

        // Gửi tin nhắn có thành viên rời group đến các client trong group và cho client socket rời group
        if (message) {
          let notification: IMainMessageJSON | null = await DAO.messageDAO.toJSON(message);
          const groupLeft: IGroupMember | null = await DAO.groupDAO.leaveGroup(params.id_user_leave, params.id_group);
          if (notification && groupLeft) {
            socket.to(message.id_group).emit(EVENT.recieve_message, notification);
            socket.leave(params.id_group);
          }
        }

        socket.leave(params.id_group);
      }
    });
  };

  public addContact = (socket: any) => {
    socket.on(EVENT.add_contact, async (params: { id_user: string; id_user_contact: string }) => {
      const user_request = await DAO.userDAO.getUserById(params.id_user);

      if (user_request) {
        const new_contact: IContactJSON | null = await DAO.contactDAO.addContact(user_request, params.id_user_contact);
        const user_online = SocketServer.onlineUsers.find((user) => user.userID === params.id_user_contact);
        if (new_contact && user_online) {
          socket.to(user_online.socketId).emit(EVENT.is_added_contact, new_contact);
        }
      }
    });
  };

  public removeContact = (socket: any) => {
    socket.on(EVENT.remove_contact, async (params: { id_user: string; id_contact: string }) => {
      const contact = await DAO.contactDAO.removeContact(params.id_contact);
      if (contact) {
        const contactJSON = await DAO.contactDAO.toJSON(contact);
        if (contactJSON && contactJSON.user_requested._id === params.id_user) {
          const user_online = SocketServer.onlineUsers.find((user) => user.userID === contactJSON.user_requested_to._id);
          if (user_online) {
            socket.to(user_online.socketId).emit(EVENT.is_removed_contact, contactJSON);
          }
        } else if (contactJSON && contactJSON.user_requested_to._id === params.id_user) {
          const user_online = SocketServer.onlineUsers.find((user) => user.userID === contactJSON.user_requested._id);
          if (user_online) {
            socket.to(user_online.socketId).emit(EVENT.is_removed_contact, contactJSON);
          }
        }
      }
    });
  };

  public acceptContact = (socket: any) => {
    socket.on(EVENT.accept_contact, async (params: { id_user: string; id_contact: string }) => {
      const user_accept = await DAO.userDAO.getUserById(params.id_user);
      let contact = await DAO.contactDAO.acceptContact(params.id_contact);
      if (user_accept && contact && user_accept.id === contact.id_user_requested_to) {
        contact = await DAO.contactDAO.acceptContact(params.id_contact);
        const contactJSON = await DAO.contactDAO.toJSON(contact);
        if (contactJSON) {
          const user_online = SocketServer.onlineUsers.find((user) => user.userID === contactJSON.user_requested._id);
          if (user_online) {
            socket.to(user_online.socketId).emit(EVENT.is_accepted_contact, contactJSON);
          }
        }
      }
    });
  };
}

const socketServer = new SocketServer();

export default socketServer;
