const Blog = require("../../models/blogs");

// Admin-only, enforced at the route via [authorizeBearerToken,
// requireRole('admin','super-admin')] (see routes/blogs.js). The update object
// itself is field-whitelisted in the model (see models/blogs.js / utils/sanitizeUpdate).
async function updateBlog(req, res) {
    try {
        const { update, id } = req.body;

        if (!id || !update || typeof update !== "object") {
            return res.status(400).json({
                message: "Missing fields required.",
            });
        }

        Blog.updateBlog(id, update, function (err, blog) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "An error occurred while updating the blog.",
                });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: blog,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while updating the blog.",
        });
    }
}

module.exports = updateBlog;
