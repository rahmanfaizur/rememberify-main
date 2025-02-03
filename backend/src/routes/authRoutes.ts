import { Router } from "express";
import passport from "passport";
import { isLoggedInGoogle } from "../middleware";

const router = Router();

router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/dashboard", // Redirect to frontend dashboard after successful login
    failureRedirect: "/auth/failure", // Failure redirect if something goes wrong
  })
);



router.get("/protected", isLoggedInGoogle, (req, res) => {
  res.json({ message: "Logged in!" });
});

router.get("/auth/failure", (req, res) => {
  res.json({ message: "Failure to login!" });
});

export default router;
