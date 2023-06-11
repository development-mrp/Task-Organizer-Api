import { IUser } from "../Modules/Users/interface";

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUser
    }
  }
}