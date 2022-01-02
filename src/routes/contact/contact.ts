import IContact, { IContactJSON } from "./../../types/contact";
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import DAO from "../../DAO";
import Token from "../../types/token";

const contactRoute = Router();

contactRoute.get("/", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const result = await DAO.contactDAO.getAllContacts(user.id);
      let resultJSON: IContactJSON[] = [];
      for (let item of result) {
        const itemJSON = await DAO.contactDAO.toJSON(item);
        if (itemJSON) {
          resultJSON.push(itemJSON);
        }
      }
      return res.status(200).json(resultJSON);
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

contactRoute.post("/add", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const id_user_contact = req.body.id_user_contact as string;
      if (id_user_contact) {
        const contactJSON: IContactJSON | null = await DAO.contactDAO.addContact(user, id_user_contact);
        if (contactJSON) {
          return res.status(200).json(contactJSON);
        }
        return res.status(400).json({ message: "Error adding contact" });
      }
      return res.status(400).json({ message: "Missing id_user_contact" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

contactRoute.post("/accept", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const id_contact: string = req.body.id_contact;
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user && id_contact) {
      const contact = await DAO.contactDAO.acceptContact(id_contact, user.id);
      const contactJSON: IContactJSON | null = await DAO.contactDAO.toJSON(contact);
      if (contactJSON) {
        return res.status(200).json(contactJSON);
      }
      return res.status(400).json({ message: "Error accepting contact: Cannot find userInfo or missing id_contact." });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

contactRoute.post("/remove", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const id_contact: string = req.body.id_contact;
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user && id_contact) {
      const contact = await DAO.contactDAO.removeContact(id_contact);
      const contactJSON: IContactJSON | null = await DAO.contactDAO.toJSON(contact);
      if (contactJSON) {
        return res.status(200).json(contactJSON);
      }
      return res.status(400).json({ message: "Error removing contact: Cannot find userInfo or missing id_contact." });
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
});

contactRoute.post("/priority", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const id_contact: string = req.body.id_contact;
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user && id_contact) {
      let contact: IContact | null = await DAO.contactDAO.getContactById(id_contact);

      if (contact != null) {
        if (contact.is_priority) {
          contact.is_priority = false;
        } else {
          contact.is_priority = true;
        }
        const new_contact = await contact.save();
        const contactJSON: IContactJSON | null = await DAO.contactDAO.toJSON(new_contact);
        if (contactJSON) {
          return res.status(200).json(contactJSON);
        }
      }

      return res.status(400).json({ message: "Error change priority contact: Canot find userInfo or missing id_contact." });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

export default contactRoute;
