import * as q from "q";
import UserTokenModel from "./model";
import { Encryption } from "../../utils/Encryption";
import HttpException from "../../../Exceptions/http.exception";
import * as JWT from "jsonwebtoken";
import moment from "moment";

export default class TokenService {
  private static $_instance: TokenService = null;

  private encrypt: Encryption = new Encryption();

  constructor() { }

  public static instance(): TokenService {
    if (TokenService.$_instance == null) {
      TokenService.$_instance = new TokenService();
    }

    return TokenService.$_instance;
  }

  public async createToken(userData: any): Promise<Error | any> {
    let defer: q.Deferred < Error | any> = q.defer < Error | any>();

    try {
      
      let userToken = {
        token: JWT.sign({
          email: userData.email,
        }, 
        process.env.APP_SECRET,
        {
          expiresIn: 60*60
        }),
        expiredAt: moment().add(1, "hour").toDate()
      }
      
      await UserTokenModel.create(userToken)

      defer.resolve(userToken);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  public async verifyToken(token: string): Promise<any> {
    let defer: q.Deferred < Error | any > = q.defer < Error | any >();

    try {
      let decodedToken: any = JWT.verify(token, process.env.APP_SECRET);
      
      if (decodedToken) {
        let userToken = await UserTokenModel.findOne({token});

        if (userToken) {
          if (moment(userToken.expiredAt).isBefore(moment())) {
            await UserTokenModel.deleteOne({_id: userToken._id});

            defer.resolve(null);
          } else {
            defer.resolve(decodedToken);
          }
        } else {
          defer.reject(new HttpException(401, "Invalid Token"));
        }
      } else {
        defer.reject(new HttpException(401, "Invalid Token"));
      }

    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }


}