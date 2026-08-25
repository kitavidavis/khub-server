const Blog = require("../../models/blogs");
const { FRONTED_URL } = require("../../constants");

async function createBlog(req, res) {
    try {
        const { title, content, featureImage, description, category, tags } = req.body;

        if (!title || !content || !featureImage || !description || !category) {
            return res.status(400).json({
                message: "Missing fields required.",
            });
        }

        const url = title
          .toLowerCase()
          .replace(/\s+/g, "-")           // Replace spaces with hyphens
          .replace(/[^a-z0-9\-]/g, "")    // Remove all non-alphanumeric and non-hyphen characters
          .replace(/-+/g, "-")            // Replace multiple hyphens with a single hyphen
          .replace(/^-+|-+$/g, "");       // Trim hyphens from start and end

        const body = {
            title,
            content,
            featureImage,
            description,
            category,
            tags,
            // writtenBy now always comes from the authenticated token, not the
            // request body - previously a caller could attribute a blog post to any
            // arbitrary user id.
            writtenBy: req.auth.uid,
            url: FRONTED_URL+"/blogs/"+url,
        };

        const newBlog = new Blog(body);

        Blog.createBlog(newBlog, function (err, blog) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while creating the blog." });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: blog,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the blog." });
    }
}

module.exports = createBlog;
