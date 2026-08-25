const EmergingEvidence = require("../../models/emerging-evidence");

async function getApprovedArticles(req, res) {
    try {
        EmergingEvidence.getApprovedArticles(function (err, articles) {
            if (err) {
                throw err;
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: articles,
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while fetching approved articles.",
        });
    }
}

module.exports = getApprovedArticles;