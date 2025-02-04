"use strict";
// const express require("express") 
//this one doesnt give any types and hence is not a good practice to use when in a typescript project!
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
const express_1 = __importDefault(require("express")); //this one does give types to express 
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
// Allow all origins
app.use((0, cors_1.default)());
// Allow specific origin(s)
// app.use(cors({
//   origin: 'https://rememberify-main.vercel.app'
// }));
// app.use(cors({
//     origin: "http://localhost:3000"
// }))
//Test
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Change this to a strong secret
    resave: false, // Prevent unnecessary session saving
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: { secure: false }, // Set to `true` if using HTTPS
}));
//passport logics!
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(authRoutes_1.default);
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //try adding zod validation here! and hashing password! Duplicate Entries!
    //zod schema
    // console.log(req.body);
    const schema = zod_1.z.object({
        username: zod_1.z.string().min(1, "Username is Required!"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters long!")
    });
    // const username = req.body.username;
    // const password = req.body.password;
    try {
        const { username, password } = schema.parse(req.body);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const existingUser = yield db_1.UserModel.findOne({
            username
        });
        if (existingUser) {
            // If username exists, throw an error with a specific message
            res.status(400).json({
                message: "Username already exists",
            });
            return;
        }
        yield db_1.UserModel.create({
            username,
            password: hashedPassword
        });
        // console.log("works until here 1!");
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
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        //! Here we tend to check that the user with that username exists in the database or not!
        const existingUser = yield db_1.UserModel.findOne({
            username
        });
        if (!existingUser) {
            return res.status(403).json({
                type: "username",
                message: "Username doesn't exist"
            });
        }
        //! here we check that the password is correct or not using the bcrypt compare!
        const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                type: "password",
                message: "Invalid password"
            });
        }
        //! now we do tend to genetate the jwt token!
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, JWT_PASS);
        //! now a confirmation message that the user has signed in!
        res.status(200).json({
            token
        });
    }
    catch (error) {
        //Just some random errors are caught here!
        console.error("Error during sign-in");
        res.status(500).json({
            message: "An error happened during sign in, Try again!"
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CourseSchema = zod_1.z.object({
        link: zod_1.z.string(),
        type: zod_1.z.string(),
        title: zod_1.z.string().min(1, "Title cannot be empty!"),
        tags: zod_1.z.array(zod_1.z.string()).optional()
    });
    try {
        const { link, type, title, tags } = CourseSchema.parse(req.body);
        // Convert tag strings to ObjectIds (or create new Tag documents)
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = yield db_1.TagModel.findOneAndUpdate({ name: tagName }, { name: tagName }, { upsert: true, new: true });
                tagIds.push(tag._id);
            }
        }
        // Create the Content document
        yield db_1.ContentModel.create({
            type,
            title,
            link,
            tags: tagIds,
            userId: req.userId // Make sure `req.userId` is correctly set by `userMiddleware`
        });
        res.json({ message: "Content Added!" });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ///@ts-ignore
    const userId = req.userId;
    try {
        const content = yield db_1.ContentModel.find({
            userId: userId //! foreign key!
        })
            .populate("userId", "username") // Existing logic to populate user details
            .populate("tags", "name"); // Added logic to populate tags with their name field
        res.json({
            content,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching content", error });
    }
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, title, type } = req.body;
    try {
        const result = yield db_1.ContentModel.deleteOne({
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
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const share = req.body.share; // Share flag from the request body
        const hash = (0, utils_1.random)(10); // Generate a random 10-character hash
        // Check if a link already exists for this user
        const existingLink = yield db_1.LinkModel.findOne({
            userId: req.userId,
        });
        // If the share flag is false, remove any existing link
        if (!share) {
            if (existingLink) {
                yield db_1.LinkModel.deleteOne({ userId: req.userId });
            }
            res.json({ message: "Removed Link!" });
            return;
        }
        // If an existing link exists and share is true, update the response
        if (existingLink) {
            res.json({ message: `/share/${existingLink.hash}` });
            return;
        }
        // Otherwise, create a new link
        yield db_1.LinkModel.create({
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
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    {
        const hash = req.params.shareLink;
        const link = yield db_1.LinkModel.findOne({
            hash: hash
        });
        const hostUserId = link === null || link === void 0 ? void 0 : link.userId.toString();
        // console.log(hostUserId);
        // We use aggregations here!
        if (!link) {
            res.status(411).json({
                message: "Sorry Incorrect Inputs!"
            });
            return; //this is early return in place of a else statement!
        }
        //userId got!
        const content = yield db_1.ContentModel.find({
            userId: hostUserId
        });
        const user = yield db_1.UserModel.findOne({
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
        // we are doing 3 sequencial calls to the backend, but we can use refrences instead and hence it will be a lot easier that way!
    }
}));
app.get("/api/v1/refresh", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        if (!type || typeof type !== "string") {
            res.status(400).json({ message: "Type is required and must be a string!" });
            return; // Ensure no further code is executed after sending a response
        }
        ///@ts-ignore
        const userId = req.userId;
        const content = yield db_1.ContentModel.find({
            userId,
            type
        }).populate("userId", "username")
            .populate("tags", "name"); // Added logic to populate tags with their name field
        res.json({
            content
        });
    }
    catch (error) {
        // Pass the error to the next middleware
        console.log("Lol!");
    }
}));
app.get('/api/v1/image/getLink', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fetchUrl } = req.query; // Access fetchUrl from query params (not body)
        // console.log(fetchUrl); // Log fetchUrl for debugging
        const result = yield (0, cloudinary_1.urlHandler)(fetchUrl); // Call your handler function
        // console.log(result); // Log result for debugging
        res.status(200).json(result); // Send back the result
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({
            error: 'Failed to fetch Url!'
        });
    }
}));
app.get("/api/v1/images", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId; // Extract user ID from decoded token
        // Fetch images and titles for the authenticated user
        const images = yield db_1.ImageModel.find({ uploaderId: userId }).select("link title");
        // Return the links and titles
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
}));
//@ts-ignore
app.post('/api/v1/image/postLink', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ImageInputSchema = zod_1.z.object({
            inputUrl: zod_1.z.string().url("Invalid URL format"),
            title: zod_1.z.string().nonempty("Title is required"), // Added title validation
            tags: zod_1.z.array(zod_1.z.string()).optional() // Optional tags
        });
        // Parse the request body
        const { inputUrl, title, tags } = ImageInputSchema.parse(req.body);
        // Upload the image to Cloudinary or any image hosting service
        const uploadResult = yield (0, cloudinary_1.imageUploader)(inputUrl);
        const url = uploadResult.url;
        // If there are tags, handle them (convert to ObjectIds or create new Tag documents)
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = yield db_1.TagModel.findOneAndUpdate({ name: tagName }, { name: tagName }, { upsert: true, new: true });
                tagIds.push(tag._id);
            }
        }
        // Save the image details in the database
        const newImage = yield db_1.ImageModel.create({
            title, // Save the title
            link: url, // Save the link
            uploaderId: req.userId, // User ID from middleware
            tags: tagIds
        });
        // Respond with success and the saved image document
        res.status(200).json({
            message: "Image uploaded and saved successfully!",
            image: newImage
        });
    }
    catch (err) {
        // Check if the error is a Zod validation error
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: "Validation error", details: err.errors });
        }
        // Handle unexpected errors
        res.status(500).json({ error: "An unexpected error occurred. Please try again." });
    }
}));
app.post('/api/v1/image/upload', upload.single('image'), // Handle a single file upload
middleware_1.userMiddleware, // Ensure the user ID is available
//@ts-ignore
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const fileBuffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer; // Access the file buffer
        const fileOriginalName = (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname; // Get the original file name
        if (!fileBuffer) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Validate optional title and tags (if any)
        const ImageInputSchema = zod_1.z.object({
            title: zod_1.z.string().nonempty(), // Title is required
            tags: zod_1.z.array(zod_1.z.string()).optional(), // Optional tags
        });
        const { title, tags } = ImageInputSchema.parse(req.body);
        // Upload the image to the file hosting service
        const uploadResult = yield (0, cloudinary_1.fileUploader)(fileBuffer, fileOriginalName || 'defaultFileName');
        // Handle tags (convert to ObjectIds or create new Tag documents)
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = yield db_1.TagModel.findOneAndUpdate({ name: tagName }, { name: tagName }, { upsert: true, new: true });
                tagIds.push(tag._id);
            }
        }
        // Save the image details in the database
        const newImage = yield db_1.ImageModel.create({
            link: uploadResult.url, // Assuming `url` contains the uploaded image's URL
            title, // Save the title
            uploaderId: req.userId, // User ID from middleware
            tags: tagIds,
        });
        // Respond with success and the saved image document
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
}));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port 3000!");
});
