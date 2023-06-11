import { Request, Response, NextFunction } from "express";
import HttpException from "../Exceptions/http.exception";

function errorMiddleware(error: HttpException, req: Request, res: Response, next:NextFunction) {
  const status = error.status || 500;
  const message = error.message || "Server error";

  res.status(status);
  res.json({
    status,
    message
  });
}

export default errorMiddleware;