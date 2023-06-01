import { RequestWithUser } from '../types/express/requestWithUser';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from "../types/custom.types";
import { config } from '../configs/config';
import { userDetails } from '../models/user.model';

export function handleTokenBasedAuth(req: RequestWithUser, res: Response, next: NextFunction) {
  const authToken = req.header("Authorization")?.replace('Bearer ', '');
  if (authToken !== undefined) {
    jwt.verify(authToken, config.token.secretKey, async (err, user) => {
      if (err) {
        return res.status(401).json({message: "Unauthorized"})
      }
      req.user = user as User;
      if(req.user.userName !== undefined){
        const findUser = await userDetails(req.user.userName);
        if(findUser){
          next();
        }else {
          return res.status(401).json({message: "Unauthorized"});
        }
      }else {
        return res.status(401).json({message: "Unauthorized"});
      }
    });
  } else {
    return res.status(401).json({message: "Unauthorized"})
  }
}
