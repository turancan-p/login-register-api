import { RequestWithUser } from '../types/express/requestWithUser';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from "../types/custom.types";
import { config } from '../configs/config';


export function handleTokenBasedAuth(req: RequestWithUser, res: Response, next: NextFunction) {
    const authToken = req.header("Authorization")?.replace('Bearer ', '');
    if (authToken !== undefined) {
        jwt.verify(authToken, config.token.secretKey, (err, user) => {
            if (err) {
                return res.status(401).json({message: "Unauthorized"})
            }
            console.log(user);
            req.user = user as User;
            next();
        });
    } else {
        return res.status(401).json({message: "Unauthorized"})
    }
}
