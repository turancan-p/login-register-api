import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { config } from "../configs/config";
import { userCreate, userDelete, userUpdate, UserRoles, userDetails,IUser } from '../models/user.model';

export const register = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const {name, userName, email, password} = req.body;

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
            password: hashedPassword as string,
            role: UserRoles.user
        };

        // create user
        const createdUser = await userCreate(userData);

        // if user created delete password data
        if (createdUser) {
            createdUser.password = "";
        }

        // then response it
        res.status(201).json({
        message: "User created successfully.",
        user: createdUser,
        });
        
    } catch (error: any) { // you can also create custom error type and change "any" to it
        console.log("User create process failed.")
        res.status(400).json(
        {
            message: error.message,
        });
    }
}

export const login = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const {userName, password} = req.body;
        if(typeof userName != 'string' || typeof password != 'string'){
            throw new Error('Invalid data type');
        }

        const user = await userDetails(userName);

        if(!user){
            throw new Error('Username or Password wrong.')
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if(err) {
                throw new Error('Something wrong at line 65.');
            }

            if(!result){
                throw new Error('Username or Password wrong.')
            }else{
                const userData = {
                   name: user.name,
                   userName: user.userName,
                   role: user.role
                }
                
                const token = jwt.sign(
                {
                    user: userData
                },
                config.token.secretKey,
                {
                    expiresIn :"2h"
                })

                res.header('Authorization', 'Bearer '+ token);
                res.status(200).json({message: "Login successfull"})
            }
        })
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}