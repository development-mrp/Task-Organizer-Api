import {
  Request,
  Response,
  NextFunction,
} from "express";
import HttpException from "../Exceptions/http.exception";
import UserService from "../Modules/Users/service";

function authorize(): MethodDecorator {
  return function(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const original = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const request = args[0] as Request;
      const response = args[1] as Response;
      const next = args[2] as NextFunction;
      
      const headers = request.headers;

      if (!headers.authorization) {
        console.log("No authorization header passed.");
        console.log(headers);
        next(new HttpException(401, `Unauthorized access.`));
        return;
      } else {
        const token = headers.authorization.split(" ")[1];
        const tokenType = headers.authorization.split(" ")[0];

        if (!token || tokenType !== 'JWT') {
          console.log("Unauthorized access token");
          next(new HttpException(401, `Unauthorized access.`));
          return;
        } else {
          try {
            let user = await UserService.instance().validateUser(token);

            if (!user) {
              next(new HttpException(401, "Invalid authorization token"));
              return;
            }

            request.currentUser = user;

            args[0] = request;

            return original.apply(this, args);
          } catch (err) {
            console.log(err);
            next(err);
            return;
          };
        }
      }
    }
  }
}

export default authorize;