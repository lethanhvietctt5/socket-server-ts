import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import DAO from "../../DAO";
import Token from "../../types/token";

const contactRoute = Router();

contactRoute.get("/", async (req: Request, res: Response) => {
  const access_token: string | undefined = req.headers["x-auth-token"]?.toString();
  if (access_token) {
    const decode = jwt.verify(access_token, "secret");
    const { email } = decode as Token;

    const result = await DAO.contactDAO.getAllContacts(email);
    return res.status(200).json(result);
  }

  return res.status(401).send("Unauthorized");
});

export default contactRoute;
