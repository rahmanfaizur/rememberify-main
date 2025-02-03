"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get("/auth/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
router.get("/auth/google/callback", passport_1.default.authenticate("google", {
    successRedirect: "http://localhost:5173/dashboard", // Redirect to frontend dashboard after successful login
    failureRedirect: "/auth/failure", // Failure redirect if something goes wrong
}));
router.get("/protected", middleware_1.isLoggedInGoogle, (req, res) => {
    res.json({ message: "Logged in!" });
});
router.get("/auth/failure", (req, res) => {
    res.json({ message: "Failure to login!" });
});
exports.default = router;
