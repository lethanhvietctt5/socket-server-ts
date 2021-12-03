import { IUser } from "./../types/user";
import UserModel from "./../models/user";

export default class UserDA {
  public getUser = async (email: string): Promise<IUser | null> => {
    const user: IUser | null = await UserModel.findOne({
      email,
    });
    return user;
  };

  // public getAllContacts = async (email: string): Promise<IUser[]> => {};
}
