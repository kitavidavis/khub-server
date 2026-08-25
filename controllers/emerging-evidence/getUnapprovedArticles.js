const EmergingEvidence = require("../../models/emerging-evidence");

// Admin-only, enforced at the route via [authorizeBearerToken,
// requireRole('admin','super-admin')] (see routes/articles.js).
async function getUnapprovedArticles(req, res) {
    try {
        EmergingEvidence.getUnapprovedArticles(function (err, articles) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while fetching unapproved articles." });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: articles,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while fetching unapproved articles.",
        });
    }
}

module.exports = getUnapprovedArticles;
