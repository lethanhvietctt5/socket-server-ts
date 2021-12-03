import { IUser } from "./../types/user";
import UserModel from "./../models/user";

export class UserDA {
  constructor() {}
  public getUserByEmail = async (email: string): Promise<IUser | null> => {
    const user: IUser | null = await UserModel.findOne({
      email,
    });
    return user;
  };

  public createUser = async (
    email: string,
    name: string,
    password: string
  ): Promise<IUser> => {
    const newUser: IUser = new UserModel({
      email: email,
      name: name,
      password: password,
    });
    const result: IUser = await newUser.save();
    return result;
  };

  // public getAllContacts = async (email: string): Promise<IUser[]> => {};
}

const userDA = new UserDA();

export default userDA;
