const express = require("express");
const { authorizeBearerToken, requireRole, requireOwnerOrRole } = require("../middlewares/jsonwebtoken");
const { approvedBlogs, unapprovedBlogs, getBlogByUrl } = require("../controllers/blogs/approvedBlogs");
const getUserBlogs = require("../controllers/blogs/getUserBlogs");
const updateBlog = require("../controllers/blogs/updateBlog");

const router = express.Router();

router.post("/create", [authorizeBearerToken], require("../controllers/blogs/create"));

// Public site content.
router.get("/approved", [], approvedBlogs);
router.get("/blog-by-url/:url", [], getBlogByUrl);

// Admin-only moderation views/actions - previously reachable with no auth at all.
// GET /deleted was removed - no frontend consumer.
router.get("/unapproved", [authorizeBearerToken, requireRole("admin", "super-admin")], unapprovedBlogs);
router.post("/update", [authorizeBearerToken, requireRole("admin", "super-admin")], updateBlog);

// A logged-in user's own blogs, or an admin viewing anyone's.
router.get("/blogs-by-userid/:userId", [authorizeBearerToken, requireOwnerOrRole("userId", "admin", "super-admin")], getUserBlogs);

module.exports = router;
