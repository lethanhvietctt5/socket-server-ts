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

  public getAllContacts = async (email: string): Promise<IContact[]> => {
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const contacts: IContact[] = await ContactModel.find({
        id_user_requested: user._id,
      });
      return contacts;
    }
    return [];
  };

  public addContact = async (user_request: IUser, email_contact: string): Promise<IContact | null> => {
    let user_requested_to: IUser | null = await DAO.userDAO.getUserByEmail(email_contact);
    if (user_requested_to) {
      let contact: IContact = new ContactModel({
        id_user_requested: user_request._id,
        id_user_requested_to: user_requested_to.id,
      });

      const result = await contact.save();
      return result;
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
      contact.removed_at = new Date(Date.now());
      const result = await contact.save();
      return result;
    }

    return null;
  };
}

const contactDAO = new ContactDAO();

export default contactDAO;
