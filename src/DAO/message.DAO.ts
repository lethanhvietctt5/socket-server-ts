import { IGroupJSON } from "./../types/group";
import IUser, { IUserJSON } from "./../types/user";
import { IMainMessageJSON } from "./../types/message";
import DAO from ".";
import MessageModel from "../models/message";
import MessageGroupModel from "../models/message_group";
import IMessage from "../types/message";
import IMessageGroup from "../types/message_group";
import IGroup from "../types/group";

export class MessageDAO {
  constructor() {}

  public getInvidualMessage = async (id_user: string, id_contact: string): Promise<IMessage[]> => {
    const messages = await MessageModel.find({
      $or: [
        {
          $and: [{ id_sender: id_user }, { id_receiver: id_contact }],
        },
        {
          $and: [{ id_sender: id_contact }, { id_receiver: id_user }],
        },
      ],
    });

    return messages;
  };

  public addInvidualMessage = async (id_sender: string, id_receiver: string, content: string, type: string = "text"): Promise<IMessage | null> => {
    const sender = await DAO.userDAO.getUserById(id_sender);
    const receiver = await DAO.userDAO.getUserById(id_receiver);
    if (sender && receiver) {
      const message: IMessage = new MessageModel({
        id_sender,
        id_receiver,
        content,
        type,
      });

      await message.save();
      return message;
    }

    return null;
  };

  public getGroupMessage = async (id_group: string): Promise<IMessageGroup[]> => {
    const messages = await MessageGroupModel.find({ id_group });

    return messages;
  };

  public addGroupMessage = async (
    id_group: string,
    id_sender: string,
    content: string,
    type: string = "text",
    is_notification: boolean = false
  ): Promise<IMessageGroup | null> => {
    const message: IMessageGroup | null = new MessageGroupModel({
      id_group,
      id_sender,
      content,
      type,
      is_notification,
    });

    if (message) {
      await message.save();
    }
    return message;
  };

  public getMainMessage = async (id_user: string): Promise<IMainMessageJSON[]> => {
    const allContacts = await DAO.contactDAO.getAllContacts(id_user);
    const allMessages: IMessage[] = [];
    for (let contact of allContacts) {
      if (contact.id_user_requested.valueOf().toString() === id_user) {
        const messages = await MessageModel.find({
          $or: [
            {
              $and: [{ id_sender: id_user }, { id_receiver: contact.id_user_requested_to }],
            },
            {
              $and: [{ id_sender: contact.id_user_requested_to }, { id_receiver: id_user }],
            },
          ],
        });
        // .sort({ datetime: -1 })
        // .limit(1);

        allMessages.push(...messages);
      } else if (contact.id_user_requested_to.valueOf().toString() === id_user) {
        const messages = await MessageModel.find({
          $or: [
            {
              $and: [{ id_sender: id_user }, { id_receiver: contact.id_user_requested }],
            },
            {
              $and: [{ id_sender: contact.id_user_requested }, { id_receiver: id_user }],
            },
          ],
        });
        // .sort({ datetime: -1 })
        // .limit(1);

        allMessages.push(...messages);
      }
    }

    const allGroups = await DAO.groupDAO.getAllGroups(id_user);
    const allGroupMessages: IMessageGroup[] = [];

    for (let group of allGroups) {
      const messages = await MessageGroupModel.find({ id_group: group._id }).sort({ datetime: -1 }).limit(1);

      allGroupMessages.push(...messages);
    }

    const result: IMainMessageJSON[] = [];

    for (let message of allMessages) {
      const sender = await DAO.userDAO.getUserById(message.id_sender);
      const senderJSON = (await DAO.userDAO.toJSON(sender)) as IUserJSON;
      const receiver = await DAO.userDAO.getUserById(message.id_receiver);
      const receiverJSON = await DAO.userDAO.toJSON(receiver);

      let singeMessage: IMainMessageJSON = {
        _id: message._id,
        sender: senderJSON,
        receiver: receiverJSON,
        group: null,
        content: message.content,
        type: message.type,
        sent_at: message.sent_at,
        is_removed: message.is_removed,
        is_notification: message.is_notification,
      };

      result.push(singeMessage);
    }

    for (let message of allGroupMessages) {
      const group = (await DAO.groupDAO.getGroupById(message.id_group)) as IGroup;
      const groupMember = await DAO.groupDAO.getYourDetails(id_user, group._id.valueOf().toString());
      const groupJSON = await DAO.groupDAO.toJSON(groupMember);
      const sender = await DAO.userDAO.getUserById(message.id_sender);
      const senderJSON = (await DAO.userDAO.toJSON(sender)) as IUserJSON;

      let groupMessage: IMainMessageJSON = {
        _id: message._id,
        sender: senderJSON,
        receiver: null,
        group: groupJSON,
        content: message.content,
        type: message.type,
        sent_at: message.sent_at,
        is_removed: message.is_removed,
        is_notification: message.is_notification,
      };

      result.push(groupMessage);
    }

    return result;
  };

  public toJSON = async (message: IMessage | IMessageGroup): Promise<IMainMessageJSON | null> => {
    const sender = await DAO.userDAO.getUserById(message.id_sender);
    const senderJSON = (await DAO.userDAO.toJSON(sender)) as IUserJSON;

    let receiver: IUser | null;
    let receiverJSON: IUserJSON | null = null;
    if ((message as IMessage).id_receiver) {
      receiver = await DAO.userDAO.getUserById((message as IMessage).id_receiver);
      receiverJSON = await DAO.userDAO.toJSON(receiver);
    }

    let group: IGroup | null;
    let groupJSON: IGroupJSON | null = null;
    if ((message as IMessageGroup).id_group) {
      group = await DAO.groupDAO.getGroupById((message as IMessageGroup).id_group);
      if (group && sender) {
        const groupMember = await DAO.groupDAO.getYourDetails(sender.id, group.id);
        groupJSON = await DAO.groupDAO.toJSON(groupMember);
      }
    }

    if (receiverJSON) {
      let singeMessage: IMainMessageJSON = {
        _id: message._id,
        sender: senderJSON,
        receiver: receiverJSON,
        group: null,
        content: message.content,
        type: message.type,
        sent_at: message.sent_at,
        is_removed: message.is_removed,
        is_notification: message.is_notification,
      };

      return singeMessage;
    } else if (groupJSON) {
      let singeMessage: IMainMessageJSON = {
        _id: message._id,
        sender: senderJSON,
        receiver: null,
        group: groupJSON,
        content: message.content,
        type: message.type,
        sent_at: message.sent_at,
        is_removed: message.is_removed,
        is_notification: message.is_notification,
      };

      return singeMessage;
    }

    return null;
  };
}

const messageDAO = new MessageDAO();

export default messageDAO;
