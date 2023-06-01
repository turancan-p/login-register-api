import { Model, Schema, Document, model } from "mongoose";

export enum UserRoles {
    user = 'user',
    admin = 'admin'
}

export interface IUser {
    name: string;
    userName: string;
    email: string;
    password: string;
    role: UserRoles;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {
    buildUser(args: IUser): IUserDocument;
}

const UserSchema: Schema<IUserDocument> = new Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    role:  { 
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.user
    }
},
{
    versionKey: false,
    timestamps: true
}
);

UserSchema.statics.buildUser = function (args: IUser): IUserDocument {
    return new this(args);
};

const User = model<IUserDocument, IUserModel>("users", UserSchema);

export default User;

//get user details
export const userDetails =async (userName: string): Promise<IUserDocument | null> => {
    const user = await User.findOne({userName: userName});
    return user
}

//user create
export const userCreate = async (userData: IUser): Promise<IUserDocument> => {
    const user = User.buildUser(userData);
    const createdUser = await user.save();
    return createdUser;
};

//user update
export const userUpdate = (userName: string, userData: Partial<IUser>): Promise<IUserDocument | null> => User.findOneAndUpdate({userName: userName}, userData, { new: true }).exec();

//user delete
export const userDelete = async (userName: string): Promise<void | null> => await User.findOneAndDelete({userName: userName});
