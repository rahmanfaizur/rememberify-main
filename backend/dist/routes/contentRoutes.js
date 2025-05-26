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
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Get all content for a user
router.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user exists in regular users
        let content = yield db_1.ContentModel.find({ userId: req.userId })
            .populate("tags", "name");
        // If no content found, check if user is a Google user
        if (!content || content.length === 0) {
            const googleUser = yield db_1.googleUserModel.findById(req.userId);
            if (googleUser) {
                content = googleUser.content;
            }
        }
        res.json({ content });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching content", error });
    }
}));
// Add new content
router.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ContentSchema = zod_1.z.object({
        link: zod_1.z.string(),
        type: zod_1.z.string(),
        title: zod_1.z.string().min(1, "Title cannot be empty!"),
        tags: zod_1.z.array(zod_1.z.string()).optional()
    });
    try {
        const { link, type, title, tags } = ContentSchema.parse(req.body);
        // Convert tag strings to ObjectIds
        const tagIds = [];
        if (tags) {
            for (const tagName of tags) {
                const tag = yield db_1.TagModel.findOneAndUpdate({ name: tagName }, { name: tagName }, { upsert: true, new: true });
                tagIds.push(tag._id);
            }
        }
        // Check if user is a Google user
        const googleUser = yield db_1.googleUserModel.findById(req.userId);
        if (googleUser) {
            // Add content to Google user's content array
            googleUser.content.push({
                type,
                link,
                title,
                tags: tagIds
            });
            yield googleUser.save();
        }
        else {
            // Add content to regular content collection
            yield db_1.ContentModel.create({
                type,
                title,
                link,
                tags: tagIds,
                userId: req.userId
            });
        }
        res.json({ message: "Content Added!" });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
// Delete content
router.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, title, type } = req.body;
    try {
        // Check if user is a Google user
        const googleUser = yield db_1.googleUserModel.findById(req.userId);
        if (googleUser) {
            // Remove content from Google user's content array
            googleUser.content = googleUser.content.filter((item) => !(item.link === link && item.title === title && item.type === type));
            yield googleUser.save();
        }
        else {
            // Remove content from regular content collection
            yield db_1.ContentModel.deleteOne({
                link,
                title,
                type,
                userId: req.userId
            });
        }
        res.json({ message: "Content deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting content", error });
    }
}));
exports.default = router;
