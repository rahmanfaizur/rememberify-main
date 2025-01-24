// const express require("express") 
//this one doesnt give any types and hence is not a good practice to use when in a typescript project!

declare global {
    namespace Express {
        export interface Request {
            userId: string
        }
    }
}
import express from "express";  //this one does give types to express 
import jwt from "jsonwebtoken";
import { ContentModel, ImageModel, LinkModel, TagModel, UserModel } from "./db";
import dotenv from 'dotenv';
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { Request, Response } from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import { urlHandler, imageUploader, fileUploader} from "./cloudinary";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
dotenv.config();

const JWT_PASS = process.env.JWT_PASS;

if (!JWT_PASS) {
    throw new Error('Missing JWT_SECRET in .env file');
  }

const app = express();
app.use(bodyParser.json());

app.use(express.json());
// Allow all origins
app.use(cors());
// Allow specific origin(s)
// app.use(cors({
//   origin: 'https://rememberify-main.vercel.app'
// }));

// app.use(cors({
//     origin: "http://localhost:3000"
// }))

app.post("/api/v1/signup", async (req: Request, res: Response) => {
    //try adding zod validation here! and hashing password! Duplicate Entries!
    //zod schema
    // console.log(req.body);
    const schema = z.object({
        username: z.string().min(1, "Username is Required!"),
        password: z.string().min(6, "Password must be at least 6 characters long!")
    })
    // const username = req.body.username;
    // const password = req.body.password;
    try {
        const { username, password } = schema.parse(req.body);
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const existingUser = await UserModel.findOne({
            username
        });

        if (existingUser) {
            // If username exists, throw an error with a specific message
            res.status(400).json({
                message: "Username already exists",
            });
            return;
        }
        await UserModel.create({
            username,
            password: hashedPassword
        })
        // console.log("works until here 1!");
        res.status(201).json({
            message: "User created successfully!"
        });
    }
    catch(err) {
    if (err instanceof z.ZodError) {
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

app.post("/api/v1/signin", async (req: Request, res: Response): Promise <any>=> {
    try {
        const { username, password } = req.body;

        //! Here we tend to check that the user with that username exists in the database or not!
        const existingUser = await UserModel.findOne({
            username
        });
        if(!existingUser) {
            return res.status(403).json({
                type: "username",
                message: "Username doesn't exist"
            });
        }
        //! here we check that the password is correct or not using the bcrypt compare!
        const isPasswordValid = await bcrypt.compare(password, existingUser.password as string);
        if (!isPasswordValid) {
            return res.status(403).json({
                type: "password",
                message: "Invalid password"
            });
        }

        //! now we do tend to genetate the jwt token!
        const token = jwt.sign(
            {id: existingUser._id},
            JWT_PASS
        );

        //! now a confirmation message that the user has signed in!
        res.status(200).json({
            token
        });
} catch (error) {
    //Just some random errors are caught here!
    console.error("Error during sign-in");
    res.status(500).json({
        message: "An error happened during sign in, Try again!"
    });
}
    
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const CourseSchema = z.object({
        link: z.string(),
        type: z.string(),
        title: z.string().min(1, "Title cannot be empty!"),
        tags: z.array(z.string()).optional()
    });

    try {
        const { link, type, title, tags } = CourseSchema.parse(req.body);

        // Convert tag strings to ObjectIds (or create new Tag documents)
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = await TagModel.findOneAndUpdate(
                    { name: tagName },
                    { name: tagName },
                    { upsert: true, new: true }
                );
                tagIds.push(tag._id);
            }
        }

        // Create the Content document
        await ContentModel.create({
            type,
            title,
            link,
            tags: tagIds,
            userId: req.userId // Make sure `req.userId` is correctly set by `userMiddleware`
        });

        res.json({ message: "Content Added!" });
    } catch (error) {
        res.status(400).json({ error: error });
    }
});


app.get("/api/v1/content", userMiddleware, async (req, res) => {
    ///@ts-ignore
    const userId = req.userId;
    try {
        const content = await ContentModel.find({
            userId: userId  //! foreign key!
        })
            .populate("userId", "username") // Existing logic to populate user details
            .populate("tags", "name"); // Added logic to populate tags with their name field

        res.json({
            content,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching content", error });
    }
});


app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const { link, title, type } = req.body;

    try {
        const result = await ContentModel.deleteOne({
            link,
            title,
            type
        });

        if (result.deletedCount > 0) {
            res.json({
                message: "Deleted successfully!"
            });
        } else {
            res.status(404).json({
                message: "Content not found."
            });
        }
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({
            message: "An error occurred while deleting the content."
        });
    }
});


interface CustomRequest extends Request {
    userId: string;
}

app.post(
    "/api/v1/brain/share",
    userMiddleware,
    async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const share = req.body.share; // Share flag from the request body
            const hash = random(10); // Generate a random 10-character hash

            // Check if a link already exists for this user
            const existingLink = await LinkModel.findOne({
                userId: req.userId,
            });

            // If the share flag is false, remove any existing link
            if (!share) {
                if (existingLink) {
                    await LinkModel.deleteOne({ userId: req.userId });
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
            await LinkModel.create({
                userId: req.userId,
                hash,
            });
            res.json({ message: `/share/${hash}` });
            return;
            
        } catch (error) {
            console.error("Error in sharing link:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

app.get("/api/v1/brain/:shareLink", async (req, res) => {{
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash: hash
    });
    const hostUserId = link?.userId.toString(); 
    // console.log(hostUserId);

    // We use aggregations here!
    if (!link) {
        res.status(411).json({
            message: "Sorry Incorrect Inputs!"
        })
        return; //this is early return in place of a else statement!
    }

    //userId got!
    const content = await ContentModel.find({
        userId: hostUserId
    })

    const user = await UserModel.findOne({
        _id: hostUserId
    })

    if (!user) {
        res.status(411).json({
            message: "User not found, error should ideally not happen here!"
        })
        return;
    }
    res.json({
        username: user.username,
        content: content
    })
    // we are doing 3 sequencial calls to the backend, but we can use refrences instead and hence it will be a lot easier that way!
}});

app.get("/api/v1/refresh", userMiddleware, async (req: Request, res: Response) => {
    try {
        const { type } = req.query;

        if (!type || typeof type !== "string") {
            res.status(400).json({ message: "Type is required and must be a string!" });
            return; // Ensure no further code is executed after sending a response
        }

        ///@ts-ignore
        const userId = req.userId;

        const content = await ContentModel.find({
            userId,
            type
        }).populate("userId", "username")
        .populate("tags", "name"); // Added logic to populate tags with their name field

        res.json({
            content
        });
    } catch (error) {
        // Pass the error to the next middleware
        console.log("Lol!");
    }
});

app.get('/api/v1/image/getLink', async (req, res) => {
    try {
        const { fetchUrl } = req.query; // Access fetchUrl from query params (not body)
        console.log(fetchUrl); // Log fetchUrl for debugging
        const result = await urlHandler(fetchUrl); // Call your handler function
        console.log(result); // Log result for debugging
        res.status(200).json(result); // Send back the result
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch Url!'
        });
    }
});

//@ts-ignore
app.post('/api/v1/image/postLink', userMiddleware, async (req, res) => {
    try {
        const ImageInputSchema = z.object({
            inputUrl: z.string().url("Invalid URL format"),
            tags: z.array(z.string()).optional() // Optional tags
        });

        // Parse the request body
        const { inputUrl, tags } = ImageInputSchema.parse(req.body);

        // Upload the image to Cloudinary or any image hosting service
        const uploadResult = await imageUploader(inputUrl);
        const url = uploadResult.url;
        console.log("URL: " + url);

        // Extract the hash from the URL
        const match = url.match(/\/([^\/?]*)\?_a=/);
        if (!match) {
            return res.status(400).json({ error: "Failed to extract hash from URL." });
        }
        const hash = match[1]; // Extracted hash (e.g., mtp0yc50jblj47sgabfn)
        console.log("Extracted Part (hash): " + hash);

        // If there are tags, handle them (convert to ObjectIds or create new Tag documents)
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = await TagModel.findOneAndUpdate(
                    { name: tagName },
                    { name: tagName },
                    { upsert: true, new: true }
                );
                tagIds.push(tag._id);
            }
        }

        // Save the image details in the database
        const newImage = await ImageModel.create({
            link: hash, // Assuming `hash` contains the uploaded image's hash
            uploaderId: req.userId, // User ID from middleware
            tags: tagIds
        });

        // Respond with success and the saved image document
        res.status(200).json({ message: "Image uploaded and saved successfully!", image: newImage });

    } catch (err) {
        console.error("Error in /api/v1/image/postLink:", err);

        // Check if the error is a Zod validation error
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation error", details: err.errors });
        }

        // Handle unexpected errors
        res.status(500).json({ error: "An unexpected error occurred. Please try again." });
    }
});


app.post(
    '/api/v1/image/upload',
    upload.single('image'), // Handle a single file upload
    userMiddleware, // Ensure the user ID is available
    //@ts-ignore
    async (req: Request, res: Response) => {
      try {
        const fileBuffer = req.file?.buffer; // Access the file buffer
        const fileOriginalName = req.file?.originalname; // Get the original file name
        if (!fileBuffer) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
  
        // Validate optional tags (if any)
        const ImageInputSchema = z.object({
          tags: z.array(z.string()).optional(), // Optional tags
        });
  
        const { tags } = ImageInputSchema.parse(req.body);
  
        // Upload the image to the file hosting service
        const uploadResult = await fileUploader(
            fileBuffer,
            fileOriginalName || 'defaultFileName'
          );
            
        // Handle tags (convert to ObjectIds or create new Tag documents)
        const tagIds = [];
        if (tags) {
          for (const tagName of tags) {
            const tag = await TagModel.findOneAndUpdate(
              { name: tagName },
              { name: tagName },
              { upsert: true, new: true }
            );
            tagIds.push(tag._id);
          }
        }
  
        // Save the image details in the database
        const newImage = await ImageModel.create({
          link: uploadResult.url, // Assuming `url` contains the uploaded image's URL
          uploaderId: req.userId, // User ID from middleware
          tags: tagIds,
        });
  
        // Respond with success and the saved image document
        res.status(200).json({
          message: 'Image uploaded and saved successfully!',
          image: newImage,
        });
      } catch (error) {
        console.error('Image upload failed:', error);
        res.status(500).json({
          error: 'Failed to upload and save image!',
        });
      }
    }
  );

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening on port 3000!")
})
