const EmergingEvidence = require("../../models/emerging-evidence");

// Admin-only, enforced at the route via [authorizeBearerToken,
// requireRole('admin','super-admin')] (see routes/articles.js).
async function approveArticle(req, res) {
    try{
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing fields required." });
        }

        EmergingEvidence.updateArticle(id, { approved: true }, function (err, updatedArticle) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while approving the article." });
            }

            res.status(200).json({
                message: "Article approved successfully",
                data: updatedArticle,
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while approving the article.",
        });
    }
}

module.exports = approveArticle;
