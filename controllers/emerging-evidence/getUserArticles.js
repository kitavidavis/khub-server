const EmergingEvidence = require("../../models/emerging-evidence");

// Ownership (or admin) is enforced at the route via requireOwnerOrRole (see
// routes/articles.js) - previously any caller could pass an arbitrary userId here.
async function getUserArticles(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required.",
            });
        }

        EmergingEvidence.getArticlesByUserId(userId, function (err, articles) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while fetching the articles." });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: articles,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while fetching the articles.",
        });
    }
}

module.exports = getUserArticles;
