import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { config } from "../configs/config";
import { userCreate, userDelete, userUpdate, UserRoles, userDetails,IUser } from '../models/user.model';
import { RequestWithUser } from "../types/express/requestWithUser";

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
      name: name,
      userName: userName,
      email: email,
      password: hashedPassword,
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
    //get username and password from request body
    const {userName, password} = req.body;
    //check the types because we don't know which type we got
    // i just need the string
    if(typeof userName != 'string' || typeof password != 'string'){
      throw new Error('Invalid or missing parameters.');
    }

    // check if there is a user with this username
    const user = await userDetails(userName);

    if(!user){
      throw new Error('Username or Password wrong.')
    }

    // password compare
    bcrypt.compare(password, user.password, (err, result) => {
      if(err) {
        throw new Error('Something wrong at line 65.');
      }

      if(!result){
        throw new Error('Username or Password wrong.')
      }else{
        // If we send user variable, all the data sent to the client, but we do not want it
        // create new variable and customize what data is sent to the client
        let data = {
          name: user.name,
          userName: user.userName,
          role: user.role
        }
        // generate token and send in response header
        const token = jwt.sign(data, config.token.secretKey, {
            expiresIn: '7d'
        });

        res.header('Authorization', 'Bearer '+ token);
        res.status(200).json({message: "Login successfull", user: data})
      }
    })
  } catch (error: any) {
    res.status(400).json({message: error.message});
  }
}

export const updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const updateParams: Partial<IUser> = req.body.updateParams;
    if(updateParams !== undefined && req.user !== undefined && req.user.userName !== undefined){
      //updateParams is have password we need to hash it again
      if(updateParams.password !== undefined){
        updateParams.password = await bcrypt.hash(updateParams.password, 10);
      }
      //username cannot be updated
      if(updateParams.userName !== undefined){
        updateParams.userName = undefined
      }
      const userNewDatas = await userUpdate(req.user.userName, updateParams);

      //we cannot show user password to client
      if(userNewDatas?.password !== undefined){
        userNewDatas.password = "";
      }
      
      res.status(200).json({newData: userNewDatas});
    }else {
      throw new Error('Update failed.')
    }  
  } catch (error: any) {
    res.status(400).json({message: error.message});
  }
}

export const deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if(req.user !== undefined && req.user.userName !== undefined){
      const userName = req.user.userName;
        const deletedUser = await userDelete(userName);
        console.log(deletedUser);
        if(deletedUser !== undefined && deletedUser !== null){
          res.status(200).json({message: "User deleted."})
        }
        else{
          throw new Error("Failed to delete user.")
        }
    }else {
      throw new Error("Invalid or missing parameters.")
    }
  } catch (error: any) {
    res.status(400).json({"Error": error.message}) 
  }
}

export const detailUser = async (req: RequestWithUser, res:Response, next: NextFunction) => {
  try {
    if(req.user !== undefined && req.user.userName !== undefined){
      const userName = req.user.userName;
      const user = await userDetails(userName);
      if(user){
        if(user.password !== undefined){
          user.password = "";
        }
        res.status(200).json({message: user})
      }else {
        throw new Error("User not found.")
      }
    }else {
      throw new Error("Invalid or missing parameters.")
    }
  } catch (error) {
    res.status(401).json({message: error})
  }
}
