import * as q from "q";
import UserModel from "./model";
import { Encryption } from "../utils/Encryption";
import HttpException from "../../Exceptions/http.exception";
import TokenService from "./Tokens/service";
import { IUser } from "./interface";

export default class UserService {
  private static $_instance: UserService = null;

  private encrypt: Encryption = new Encryption();

  constructor() { }

  public static instance(): UserService {
    if (UserService.$_instance == null) {
      UserService.$_instance = new UserService();
    }

    return UserService.$_instance;
  }

  /**
   * @Comment Function to fetch users list with pagination 
   * @param whereContidion {schema: any}
   * */
  public async getUsers(
    whereCondition: any
  ): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      let page: number = 1;
      let pageSize: number = 10;
      let where: any = {};

      if (whereCondition.page) {
        page = whereCondition.page
      }

      if (whereCondition.pageSize) {
        pageSize = whereCondition.pageSize
      }

      if (whereCondition.where && Object.keys(whereCondition.where).length > 0) {
        if (whereCondition.where.name && whereCondition.where.name.trim().length > 0) {
          where.name =  { $regex: whereCondition.where.name } ;
        }

        if (whereCondition.where.email && whereCondition.where.email.trim().length > 0) {
          where.email =  { $regex: whereCondition.where.email } ;
        }
      }

      console.log("where", where);

      let users: any = await UserModel.find(where).sort({'email':1}).skip((page - 1) * pageSize).limit(pageSize);

      defer.resolve({
        users,
        page,
        pageSize
      });

    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  /**
   * @Comment Function to fetch user by id 
   * @param userId {schema: string}
   * */
  public async getUserById(
    userId: string
  ): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      let user = await UserModel.findById(userId);

      if (!user) {
        defer.reject(new HttpException(404, 'User not found'));

        return defer.promise;
      }

      defer.resolve(user);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  /**
   * @Comment Function to add new user 
   * @param user {schema: IUser}
   * */
  public async addUser(
    user: any
  ): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();
    try {
      let userData = await UserModel.findOne({
        email: user.email
      });

      if (userData) {
        defer.reject(new HttpException(400, "User already exists"));

        return defer.promise;
      }

      userData = await UserModel.create({
        role: 'web_user',
        name: user.name,
        email: user.email,
        password: await this.encrypt.generateHash(user.password)
      });

      defer.resolve({
        status: 'success',
        message: 'User created successfully'
      });
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  /**
  * @Comment Function to update Users
  * @param whereCondition {schema: any}
  * */
  public async updateUsers(
    userData: any,
    whereCondition: any
  ): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      let user: any = await UserModel.updateMany(whereCondition, userData);

      defer.resolve(user);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  /**
   * @Comment Function to delete User
   * @param whereCondition {schema: any}
   * */
  public async removeUser(
    whereCondition: any
  ): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      let res: any = await UserModel.deleteMany(whereCondition);

      defer.resolve(res);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  /**
   * @Comment Function to delete User by id 
   */
  public async deleteUser(id: string): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      let res: any = await UserModel.deleteOne({ _id: id });

      defer.resolve(res);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

   /**
   * @Comment Function to delete User by id 
   */
  public async login(email: string, password: string): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      let userData = await UserModel.findOne({ email: email });

      if (!userData) {
        defer.reject(new HttpException(404, `User not found`));

        return defer.promise;
      }

      if (await this.encrypt.verifyHash(password, userData.password)) {
        let userToken = await TokenService.instance().createToken(userData);

        console.log(userToken);

        defer.resolve({
          token: `JWT ${userToken.token}`,
          expiredAt: userToken.expiredAt
        });
      } else {
        defer.reject(new HttpException(404, `Invalid email and password combination not found.`));
      }      
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  public async validateUser(token: string): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      let decodedToken = await TokenService.instance().verifyToken(token);

      if (!decodedToken) {
        defer.reject(new HttpException(404, `Token not found`));

        return defer.promise;
      }

      let userData = await UserModel.findOne({ email: decodedToken.email });

      if (!userData) {
        defer.reject(new HttpException(404, `User not found`));

        return defer.promise;
      }

      defer.resolve(userData);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  public async createAdminUser(requestData: any): q.Promise<Error | any> {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      let user: any = await UserModel.create({ 
        email: requestData.email, 
        name: requestData.name, 
        password: await this.encrypt.generateHash(requestData.password), 
        role: 'admin' 
      });

      defer.resolve({
        message: "Success"
      });
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }
}