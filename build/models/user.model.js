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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDelete = exports.userUpdate = exports.userCreate = exports.userDetails = exports.UserRoles = void 0;
const mongoose_1 = require("mongoose");
var UserRoles;
(function (UserRoles) {
    UserRoles["user"] = "user";
    UserRoles["admin"] = "admin";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.user
    }
}, {
    versionKey: false,
    timestamps: true
});
UserSchema.statics.buildUser = function (args) {
    return new this(args);
};
const User = (0, mongoose_1.model)("users", UserSchema);
exports.default = User;
//get user details
const userDetails = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ userName: userName });
    return user;
});
exports.userDetails = userDetails;
//user create
const userCreate = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = User.buildUser(userData);
    const createdUser = yield user.save();
    return createdUser;
});
exports.userCreate = userCreate;
//user update
const userUpdate = (userName, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOneAndUpdate({ userName: userName }, userData, { new: true });
    return user;
});
exports.userUpdate = userUpdate;
//user delete
const userDelete = (userName) => __awaiter(void 0, void 0, void 0, function* () { return yield User.findOneAndDelete({ userName: userName }); });
exports.userDelete = userDelete;
