import { IContactJSON } from "./../../types/contact";
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

    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

contactRoute.post("/add", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const contactJSON: IContactJSON | null = await DAO.contactDAO.addContact(user, req.body.email_request_to);
      if (contactJSON) {
        return res.status(200).json(contactJSON);
      }

      return res.status(400).json({ message: "Error adding contact" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

contactRoute.post("/accept", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const id_contact: string = req.body.id_contact;
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user && id_contact) {
      const contact = await DAO.contactDAO.acceptContact(id_contact);
      const contactJSON: IContactJSON | null = await DAO.contactDAO.toJSON(contact);
      if (contactJSON) {
        return res.status(200).json(contactJSON);
      }
      return res.status(400).json({ message: "Contact not found" });
    }
    return res.status(401).json({ message: "Unauthorized" });
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
      return res.status(400).json({ message: "Contact not found" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

export default contactRoute;
