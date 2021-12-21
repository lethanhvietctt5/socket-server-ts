import { IUserJSON } from "./../types/user";
import IUser from "../types/user";
import UserModel from "../models/user";

export class UserDAO {
  constructor() {}
  public getUserByEmail = async (email: string): Promise<IUser | null> => {
    const user: IUser | null = await UserModel.findOne({
      email,
    });
    return user;
  };

  public getUserById = async (id: string): Promise<IUser | null> => {
    const user: IUser | null = await UserModel.findById(id);
    return user;
  };

  public createUser = async (email: string, name: string, password: string): Promise<IUser> => {
    const newUser: IUser = new UserModel({
      email: email,
      name: name,
      password: password,
    });
    const result: IUser = await newUser.save();
    return result;
  };

  public searchUser = async (keyword: string): Promise<IUser[]> => {
    let result: IUser[] = await UserModel.find({
      $text: { $search: keyword },
      $state: true,
      hide: false,
    });

    return result;
  };

  public toJSON = async (user: IUser | null): Promise<IUserJSON | null> => {
    if (user) {
      const userJSON: IUserJSON = {
        _id: user._id.valueOf().toString(),
        email: user.email,
        name: user.name,
        password: user.password,
        image_url: user.image_url,
        created_at: user.created_at,
      };

      return userJSON;
    }

    return null;
  };
}

const userDAO = new UserDAO();

export default userDAO;