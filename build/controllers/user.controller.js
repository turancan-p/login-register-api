"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPage = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configs/config");
const user_model_1 = require("../models/user.model");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, userName, email, password } = req.body;
        if (typeof name !== 'string' || typeof userName !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            throw new Error('Invalid data type');
        }
        // hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // create user datas
        const userData = {
            name: name,
            userName: userName,
            email: email,
            password: hashedPassword,
            role: user_model_1.UserRoles.user
        };
        // create user
        const createdUser = yield (0, user_model_1.userCreate)(userData);
        // if user created delete password data
        if (createdUser) {
            createdUser.password = "";
        }
        // then response it
        res.status(201).json({
            message: "User created successfully.",
            user: createdUser,
        });
    }
    catch (error) { // you can also create custom error type and change "any" to it
        console.log("User create process failed.");
        res.status(400).json({
            message: error.message,
        });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get username and password from request body
        const { userName, password } = req.body;
        //check the types because we don't know which type we got
        // i just need the string
        if (typeof userName != 'string' || typeof password != 'string') {
            throw new Error('Invalid data type');
        }
        // check if there is a user with this username
        const user = yield (0, user_model_1.userDetails)(userName);
        if (!user) {
            throw new Error('Username or Password wrong.');
        }
        // password compare
        bcrypt_1.default.compare(password, user.password, (err, result) => {
            if (err) {
                throw new Error('Something wrong at line 65.');
            }
            if (!result) {
                throw new Error('Username or Password wrong.');
            }
            else {
                // If we send user variable, all the data sent to the client, but we do not want it
                // create new json and customize what data is sent to the client
                const userData = {
                    name: user.name,
                    userName: user.userName,
                    role: user.role
                };
                // generate token and send in response header
                const token = jsonwebtoken_1.default.sign({
                    user: userData
                }, config_1.config.token.secretKey, {
                    expiresIn: "2h"
                });
                res.header('Authorization', 'Bearer ' + token);
                res.status(200).json({ message: "Login successfull", user: userData });
            }
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.login = login;
const testPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "here we go." });
    }
    catch (error) {
        res.status(401).json({ message: error });
    }
});
exports.testPage = testPage;
