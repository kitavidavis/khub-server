const { FRONTED_URL } = require("../../constants");
const Blog = require("../../models/blogs");

// /approved and /blog-by-url are intentionally public (public site content).
// /unapproved is an admin-only moderation view - gated at the route via
// [authorizeBearerToken, requireRole('admin','super-admin')] (see routes/blogs.js).
// getDeletedBlogs/getDeletedBlogs route was removed - no frontend consumer.
async function approvedBlogs(req, res) {
    try {
        Blog.getApprovedBlogs(function (err, blogs) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while fetching blogs." });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: blogs,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching blogs." });
    }
}

async function unapprovedBlogs(req, res) {
    try {
        Blog.getUnapprovedBlogs(function (err, blogs) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while fetching blogs." });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: blogs,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching blogs." });
    }
}

async function getBlogByUrl(req, res) {
    try {
        const { url } = req.params;

        if (!url) {
            return res.status(400).json({
                message: "Missing fields required.",
            });
        }

        const storedUrl = FRONTED_URL+"/blogs/"+url;

        Blog.getBlogByUrl(storedUrl, function (err, blog) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while fetching the blog." });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: blog,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching the blog." });
    }
}

module.exports = {
    approvedBlogs,
    unapprovedBlogs,
    getBlogByUrl
};
