const Blog = require("../../models/blogs");

// Ownership (or admin) is enforced at the route via requireOwnerOrRole (see
// routes/blogs.js) - previously any caller could pass an arbitrary userId here.
async function getUserBlogs(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "Missing fields required.",
            });
        }

        Blog.getBlogsByUserId(userId, function (err, blogs) {
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

module.exports = getUserBlogs;
