"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cloudinary_1 = require("./cloudinary");
const multer_1 = __importDefault(require("multer"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
require("./config/passportConfig");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
dotenv_1.default.config();
const JWT_PASS = process.env.JWT_PASS;
if (!JWT_PASS) {
    throw new Error('Missing JWT_SECRET in .env file');
}
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(authRoutes_1.default);
app.get('/healthcheck', (_, res) => {
    res.status(200).json({
        message: "Server is up and running!"
    });
});
app.post("/api/v1/signup", async (req, res) => {
    const schema = zod_1.z.object({
        username: zod_1.z.string().min(1, "Username is Required!"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters long!")
    });
    try {
        const { username, password } = schema.parse(req.body);
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const existingUser = await db_1.UserModel.findOne({
            username
        });
        if (existingUser) {
            res.status(400).json({
                message: "Username already exists",
            });
            return;
        }
        await db_1.UserModel.create({
            username,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User created successfully!"
        });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation Error", errors: err.errors
            });
            return;
        }
        res.status(500).json({
            message: "You did something wonky! Prolly User already exists!"
        });
        console.error(err);
    }
});
app.post("/api/v1/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await db_1.UserModel.findOne({
            username
        });
        if (!existingUser) {
            return res.status(403).json({
                type: "username",
                message: "Username doesn't exist"
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                type: "password",
                message: "Invalid password"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, JWT_PASS);
        res.status(200).json({
            token
        });
    }
    catch (error) {
        console.error("Error during sign-in");
        res.status(500).json({
            message: "An error happened during sign in, Try again!"
        });
    }
});
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const CourseSchema = zod_1.z.object({
        link: zod_1.z.string(),
        type: zod_1.z.string(),
        title: zod_1.z.string().min(1, "Title cannot be empty!"),
        tags: zod_1.z.array(zod_1.z.string()).optional()
    });
    try {
        const { link, type, title, tags } = CourseSchema.parse(req.body);
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = await db_1.TagModel.findOneAndUpdate({ name: tagName }, { name: tagName }, { upsert: true, new: true });
                tagIds.push(tag._id);
            }
        }
        await db_1.ContentModel.create({
            type,
            title,
            link,
            tags: tagIds,
            userId: req.userId
        });
        res.json({ message: "Content Added!" });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const content = await db_1.ContentModel.find({
            userId: userId
        })
            .populate("userId", "username")
            .populate("tags", "name");
        res.json({
            content,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching content", error });
    }
});
app.delete("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const { link, title, type } = req.body;
    try {
        const result = await db_1.ContentModel.deleteOne({
            link,
            title,
            type
        });
        if (result.deletedCount > 0) {
            res.json({
                message: "Deleted successfully!"
            });
        }
        else {
            res.status(404).json({
                message: "Content not found."
            });
        }
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({
            message: "An error occurred while deleting the content."
        });
    }
});
app.post("/api/v1/brain/share", middleware_1.userMiddleware, async (req, res) => {
    try {
        const share = req.body.share;
        const hash = (0, utils_1.random)(10);
        const existingLink = await db_1.LinkModel.findOne({
            userId: req.userId,
        });
        if (!share) {
            if (existingLink) {
                await db_1.LinkModel.deleteOne({ userId: req.userId });
            }
            res.json({ message: "Removed Link!" });
            return;
        }
        if (existingLink) {
            res.json({ message: `/share/${existingLink.hash}` });
            return;
        }
        await db_1.LinkModel.create({
            userId: req.userId,
            hash,
        });
        res.json({ message: `/share/${hash}` });
        return;
    }
    catch (error) {
        console.error("Error in sharing link:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    {
        const hash = req.params.shareLink;
        const link = await db_1.LinkModel.findOne({
            hash: hash
        });
        const hostUserId = link?.userId.toString();
        if (!link) {
            res.status(411).json({
                message: "Sorry Incorrect Inputs!"
            });
            return;
        }
        const content = await db_1.ContentModel.find({
            userId: hostUserId
        });
        const user = await db_1.UserModel.findOne({
            _id: hostUserId
        });
        if (!user) {
            res.status(411).json({
                message: "User not found, error should ideally not happen here!"
            });
            return;
        }
        res.json({
            username: user.username,
            content: content
        });
    }
});
app.get("/api/v1/refresh", middleware_1.userMiddleware, async (req, res) => {
    try {
        const { type } = req.query;
        if (!type || typeof type !== "string") {
            res.status(400).json({ message: "Type is required and must be a string!" });
            return;
        }
        const userId = req.userId;
        const content = await db_1.ContentModel.find({
            userId,
            type
        }).populate("userId", "username")
            .populate("tags", "name");
        res.json({
            content
        });
    }
    catch (error) {
        console.log("Lol!");
    }
});
app.get('/api/v1/image/getLink', middleware_1.userMiddleware, async (req, res) => {
    try {
        const { fetchUrl } = req.query;
        const result = await (0, cloudinary_1.urlHandler)(fetchUrl);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to fetch Url!'
        });
    }
});
app.get("/api/v1/images", middleware_1.userMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const images = await db_1.ImageModel.find({ uploaderId: userId }).select("link title");
        res.json({
            images: images.map((img) => ({
                link: img.link,
                title: img.title,
            })),
        });
    }
    catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.post('/api/v1/image/postLink', middleware_1.userMiddleware, async (req, res) => {
    try {
        const ImageInputSchema = zod_1.z.object({
            inputUrl: zod_1.z.string().url("Invalid URL format"),
            title: zod_1.z.string().nonempty("Title is required"),
            tags: zod_1.z.array(zod_1.z.string()).optional()
        });
        const { inputUrl, title, tags } = ImageInputSchema.parse(req.body);
        const uploadResult = await (0, cloudinary_1.imageUploader)(inputUrl);
        const url = uploadResult.url;
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = await db_1.TagModel.findOneAndUpdate({ name: tagName }, { name: tagName }, { upsert: true, new: true });
                tagIds.push(tag._id);
            }
        }
        const newImage = await db_1.ImageModel.create({
            title,
            link: url,
            uploaderId: req.userId,
            tags: tagIds
        });
        res.status(200).json({
            message: "Image uploaded and saved successfully!",
            image: newImage
        });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: "Validation error", details: err.errors });
        }
        res.status(500).json({ error: "An unexpected error occurred. Please try again." });
    }
});
app.post('/api/v1/image/upload', upload.single('image'), middleware_1.userMiddleware, async (req, res) => {
    try {
        const fileBuffer = req.file?.buffer;
        const fileOriginalName = req.file?.originalname;
        if (!fileBuffer) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const ImageInputSchema = zod_1.z.object({
            title: zod_1.z.string().nonempty(),
            tags: zod_1.z.array(zod_1.z.string()).optional(),
        });
        const { title, tags } = ImageInputSchema.parse(req.body);
        const uploadResult = await (0, cloudinary_1.fileUploader)(fileBuffer, fileOriginalName || 'defaultFileName');
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = await db_1.TagModel.findOneAndUpdate({ name: tagName }, { name: tagName }, { upsert: true, new: true });
                tagIds.push(tag._id);
            }
        }
        const newImage = await db_1.ImageModel.create({
            link: uploadResult.url,
            title,
            uploaderId: req.userId,
            tags: tagIds,
        });
        res.status(200).json({
            message: 'Image uploaded and saved successfully!',
            image: newImage,
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to upload and save image!',
        });
    }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port 3000!");
});
