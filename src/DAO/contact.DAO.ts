import { IUserJSON } from "../types/user";
import { IContactJSON } from "../types/contact";
import IContact from "../types/contact";
import ContactModel from "../models/contact";
import IUser from "../types/user";
import DAO from "./index";

export class ContactDAO {
  constructor() {}

  public getContactById = async (id_contact: string): Promise<IContact | null> => {
    const contact: IContact | null = await ContactModel.findById(id_contact);
    return contact;
  };

  public getAllContacts = async (user_id: string): Promise<IContact[]> => {
    const user = await DAO.userDAO.getUserById(user_id);
    if (user) {
      const contacts: IContact[] = await ContactModel.find({
        $or: [{ id_user_requested: user._id }, { id_user_requested_to: user._id }],
      });
      return contacts;
    }
    return [];
  };

  public addContact = async (user_request: IUser, id_user_contact: string): Promise<IContactJSON | null> => {
    const user_requested_to: IUser | null = await DAO.userDAO.getUserById(id_user_contact);
    if (user_requested_to) {
      let contacts: IContact[] = await ContactModel.find({
        $or: [
          { $and: [{ id_user_requested: user_request._id }, { id_user_requested_to: user_requested_to._id }] },
          { $and: [{ id_user_requested: user_requested_to._id }, { id_user_requested_to: user_request._id }] },
        ],
      });

      if (contacts.length === 0) {
        let contact: IContact = new ContactModel({
          id_user_requested: user_request._id,
          id_user_requested_to: user_requested_to.id,
          removed_at: null,
        });

        await contact.save();
        return this.toJSON(contact);
      } else if (contacts[0].removed_at) {
        contacts[0].id_user_requested = user_request._id;
        contacts[0].id_user_requested_to = user_requested_to._id;
        contacts[0].removed_at = null;
        contacts[0].is_accepted = false;
        await contacts[0].save();
        return this.toJSON(contacts[0]);
      }
      return null;
    }
    return null;
  };

  public acceptContact = async (id_contact: string): Promise<IContact | null> => {
    let contact: IContact | null = await this.getContactById(id_contact);
    if (contact) {
      contact.is_accepted = true;
      const result = await contact.save();
      return result;
    }

    return null;
  };

  public removeContact = async (id_contact: string): Promise<IContact | null> => {
    let contact: IContact | null = await this.getContactById(id_contact);
    if (contact) {
      contact.is_accepted = false;
      contact.removed_at = new Date(Date.now());
      const result = await contact.save();
      return result;
    }

    return null;
  };

  public toJSON = async (contact: IContact | null): Promise<IContactJSON | null> => {
    let result: IContactJSON | null = null;
    if (contact) {
      const user_requested = await DAO.userDAO.getUserById(contact.id_user_requested.valueOf().toString());
      const user_requested_to = await DAO.userDAO.getUserById(contact.id_user_requested_to.valueOf().toString());
      if (user_requested && user_requested_to) {
        const user_requested_json = await DAO.userDAO.toJSON(user_requested);
        const user_requested_to_json = await DAO.userDAO.toJSON(user_requested_to);

        if (user_requested_json && user_requested_to_json) {
          result = {
            _id: contact._id.valueOf().toString(),
            user_requested: user_requested_json,
            user_requested_to: user_requested_to_json,
            is_accepted: contact.is_accepted,
            removed_at: contact.removed_at,
          };
        }
      }
    }
    return result;
  };
}

const contactDAO = new ContactDAO();

export default contactDAO;
