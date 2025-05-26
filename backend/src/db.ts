import mongoose from "mongoose";
import { model, Schema } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

async function connectDb() {
    await mongoose.connect(MONGO_URL as any);
    console.log("Connected to the server!");
}

connectDb();

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema)

//create content schema and then the content endpoint as well!

const ContentSchema = new Schema({
    title: String,
    link: String,
    type: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

export const ContentModel = model("Content", ContentSchema);

// Assuming you have an ImageSchema defined like this
const ImageSchema = new Schema({
    title: String,
    link: String, // URL of the uploaded image
    uploaderId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // User who uploaded the image
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }] // Optional tags
});

export const ImageModel = model("Image", ImageSchema);

const TagSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

export const TagModel = model("Tag", TagSchema);


const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true,
    unique: true},
    permissions: {
        type: [String], // Array of strings
        required: true, // Add any necessary constraints
    }
})

export const LinkModel = model("Links", LinkSchema);


const googleUserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, required: true }, 
    username: { type: String, required: true }, // Removed unique constraint from username
    email: { type: String, required: true }, // Removed unique constraint from email
    profilePicture: { type: String },
    lastLogin: { type: Date, default: Date.now },
    isGoogleUser: { type: Boolean, default: true },
    content: [{
        type: { type: String, required: true },
        link: { type: String, required: true },
        title: { type: String, required: true },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
    }]
}, { timestamps: true });

// Create a compound index for email and googleId to ensure uniqueness
googleUserSchema.index({ email: 1, googleId: 1 }, { unique: true });

// Prevent model overwrite issue
export const googleUserModel = mongoose.models.GoogleUser || mongoose.model("GoogleUser", googleUserSchema);
