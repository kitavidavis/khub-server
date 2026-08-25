const express = require("express");
const { authorizeBearerToken } = require("../middlewares/jsonwebtoken");
const { externalApiRateLimiter } = require("../utils/app");
const createBlog = require("../controllers/llm/createBlog");

const router = express.Router();

// Previously mounted with [] (no auth) - any anonymous caller could trigger metered
// Anthropic API calls at will. Now requires a logged-in user and is rate-limited.
router.post("/create-blog", [authorizeBearerToken, externalApiRateLimiter], createBlog);

module.exports = router;
