const express = require("express");
const { authorizeBearerToken, requireRole, requireOwnerOrRole } = require("../middlewares/jsonwebtoken");
const { createTweet, fetchTweets, fetchUserTweets, removeUserTweets } = require("../controllers/tweets/api");

const router = express.Router();

// Admin-only - previously reachable with no auth at all (anyone could inject or
// delete any tweet association record).
router.post("/create", [authorizeBearerToken, requireRole("admin", "super-admin")], createTweet);

// Public - the guest-facing social media wall reads this.
router.get("/all", [], fetchTweets);

// A logged-in user's own tweets, or an admin viewing anyone's.
router.get("/user-tweets/:userId", [authorizeBearerToken, requireOwnerOrRole("userId", "admin", "super-admin")], fetchUserTweets);

// Was GET (a destructive action behind a plain link/<img> tag is a CSRF footgun and
// gets cached/prefetched) with no auth. Now a real DELETE and admin-only.
router.delete("/:tweetId", [authorizeBearerToken, requireRole("admin", "super-admin")], removeUserTweets);

module.exports = router;
