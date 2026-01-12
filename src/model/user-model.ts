import mongoose, {Document, Schema} from "mongoose";

//define message structure
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

//define message schema
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

//define user structure
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: string;
    isVerified: boolean;
    messages: Message[];
    isAcceptingMessage: boolean;
}

//define user Schema
const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\.,+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verify Code is required"],
    },
    verifyCodeExpiry: {
        type: String,
        required: [true, "verify code is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]   
})

const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema)
export default userModel;
