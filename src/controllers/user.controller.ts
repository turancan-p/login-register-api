import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { config } from "../configs/config";
import { userCreate, userDelete, userUpdate, UserRoles, IUser } from '../models/user.model';

export const register = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const {name, userName, email, password} = req.query;

        if (typeof name !== 'string' || typeof userName !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            throw new Error('Invalid data type');
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user datas
        const userData: IUser = {
        name: name as string,
        userName: userName as string,
        email: email as string,
        password: hashedPassword,
        };

        // create user
        const createdUser = await userCreate(userData);

        // if user created delete password data
        if (createdUser) {
        createdUser.password = undefined;
        }

        // then response it
        res.status(201).json({
        message: "User created successfully.",
        user: createdUser,
        });
        
    } catch (error: any) { // you can also create custom error type and change "any" to it
        res.status(400).json({
            message: error.message,
        });
    }
}