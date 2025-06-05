import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../app/helper/jwtHelper";
import config from "../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../app/errors/ApiError";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
      }
      const verify = verifyToken(token, config.jwt.jwtSecret as Secret);
      if (!verify || !roles.includes(verify.role)) {
        throw new ApiError(
          403,
          "Forbidden: You do not have permission to access this resource"
        );
        }
        req.user = verify
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
