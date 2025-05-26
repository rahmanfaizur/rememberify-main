import { Router } from "express";
import { ContentModel, TagModel, googleUserModel } from "../db";
import { isLoggedInGoogle, userMiddleware } from "../middleware";
import { z } from "zod";
import mongoose from "mongoose";

interface ContentItem {
    type: string;
    link: string;
    title: string;
    tags: mongoose.Types.ObjectId[];
}

const router = Router();

// Get all content for a user
router.get("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        // Check if user exists in regular users
        let content = await ContentModel.find({ userId: req.userId })
            .populate("tags", "name");

        // If no content found, check if user is a Google user
        if (!content || content.length === 0) {
            const googleUser = await googleUserModel.findById(req.userId);
            if (googleUser) {
                content = googleUser.content;
            }
        }

        res.json({ content });
    } catch (error) {
        res.status(500).json({ message: "Error fetching content", error });
    }
});

// Add new content
router.post("/api/v1/content", userMiddleware, async (req, res) => {
    const ContentSchema = z.object({
        link: z.string(),
        type: z.string(),
        title: z.string().min(1, "Title cannot be empty!"),
        tags: z.array(z.string()).optional()
    });

    try {
        const { link, type, title, tags } = ContentSchema.parse(req.body);

        // Convert tag strings to ObjectIds
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

        // Check if user is a Google user
        const googleUser = await googleUserModel.findById(req.userId);
        if (googleUser) {
            // Add content to Google user's content array
            googleUser.content.push({
                type,
                link,
                title,
                tags: tagIds
            });
            await googleUser.save();
        } else {
            // Add content to regular content collection
            await ContentModel.create({
                type,
                title,
                link,
                tags: tagIds,
                userId: req.userId
            });
        }

        res.json({ message: "Content Added!" });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Delete content
router.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const { link, title, type } = req.body;

    try {
        // Check if user is a Google user
        const googleUser = await googleUserModel.findById(req.userId);
        if (googleUser) {
            // Remove content from Google user's content array
            googleUser.content = googleUser.content.filter(
                (item: ContentItem) => !(item.link === link && item.title === title && item.type === type)
            );
            await googleUser.save();
        } else {
            // Remove content from regular content collection
            await ContentModel.deleteOne({
                link,
                title,
                type,
                userId: req.userId
            });
        }

        res.json({ message: "Content deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting content", error });
    }
});

export default router; 