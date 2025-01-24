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
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Temporary directory to store uploaded files
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
app.get('/api/v1/image/getLink', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fetchUrl } = req.query; // Access fetchUrl from query params (not body)
        console.log(fetchUrl); // Log fetchUrl for debugging
        const result = yield (0, cloudinary_1.urlHandler)(fetchUrl); // Call your handler function
        console.log(result); // Log result for debugging
        res.status(200).json(result); // Send back the result
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch Url!'
        });
    }
}));
app.post('/api/v1/image/postLink', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ImageInputSchema = zod_1.z.object({
        inputUrl: zod_1.z.string().url("Invalid URL format"),
        tags: zod_1.z.array(zod_1.z.string()).optional() // Optional tags
    });
    // Parse the request body
    const { inputUrl, tags } = ImageInputSchema.parse(req.body);
    // Upload the image to Cloudinary or any image hosting service
    const uploadResult = yield (0, cloudinary_1.imageUploader)(inputUrl);
    // If there are tags, handle them (convert to ObjectIds or create new Tag documents)
    const tagIds = [];
    if (tags) {
        for (const tagName of tags) {
            const tag = yield db_1.TagModel.findOneAndUpdate({ name: tagName }, { name: tagName }, { upsert: true, new: true });
            tagIds.push(tag._id);
        }
    }
    const url = uploadResult.url;
    console.log("URL: " + url);
    // Extract the hash from the URL
    const match = url.match(/\/([^\/?]*)\?_a=/);
    if (match) {
        const hash = match[1]; // Extracted hash (e.g., mtp0yc50jblj47sgabfn)
        console.log("Extracted Part (hash): " + hash);
        // Save the image details in the database
        const newImage = yield db_1.ImageModel.create({
            link: hash, // Assuming `url` contains the uploaded image's URL
            uploaderId: req.userId, // User ID from middleware
            tags: tagIds
        });
        // Respond with success and the saved image document
        res.status(200).json({ message: "Image uploaded and saved successfully!", image: newImage });
    }
}));
app.post('/api/v1/image/upload', upload.single('image'), middleware_1.userMiddleware, // Ensure the user ID is available
(req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path; // Access the uploaded file's path
            if (!filePath) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            // Validate optional tags (if any)
            const ImageInputSchema = zod_1.z.object({
                tags: zod_1.z.array(zod_1.z.string()).optional() // Optional tags
            });
            const { tags } = ImageInputSchema.parse(req.body);
            // Upload the image to the file hosting service
            const uploadResult = yield (0, cloudinary_1.fileUploader)(filePath);
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
                uploaderId: req.userId, // User ID from middleware
                tags: tagIds
            });
            // Respond with success and the saved image document
            res.status(200).json({ message: 'Image uploaded and saved successfully!', image: newImage });
        }
        catch (error) {
            console.error('Image upload failed:', error);
            res.status(500).json({
                error: 'Failed to upload and save image!',
            });
        }
    }))();
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port 3000!");
});
