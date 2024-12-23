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
import { ContentModel, LinkModel, UserModel } from "./db";
import dotenv from 'dotenv';
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { Request, Response } from "express";
import cors from "cors";

dotenv.config();

const JWT_PASS = process.env.JWT_PASS;

if (!JWT_PASS) {
    throw new Error('Missing JWT_SECRET in .env file');
  }

const app = express();

app.use(express.json());
app.use(cors());

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
                message: "Incorrect Credentials, User not found!"
            });
        }
        //! here we check that the password is correct or not using the bcrypt compare!
        const isPasswordValid = await bcrypt.compare(password, existingUser.password as string);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Incorrect Credentials! Invalid password!"
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
        title: z.string().min(1, "Title cannot be empty!")
    })
    0
    const { link, type, title } = CourseSchema.parse(req.body);

    await ContentModel.create({
        type,
        title,
        link,
        tags: [],
        //@ts-ignore
        userId: req.userId
    });
    res.json({
        message: "Content Added!"
    })
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    ///@ts-ignore
    const userId = req.userId
    const content = await ContentModel.find({

        userId: userId  //! foreign key!
    }).populate("userId", "username")
    res.json({
        content
    });
})

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening on port 3000!")
})
