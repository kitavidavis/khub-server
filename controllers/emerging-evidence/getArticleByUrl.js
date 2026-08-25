const { FRONTED_URL } = require("../../constants");
const EmergingEvidence = require("../../models/emerging-evidence");

async function getArticleByUrl(req, res) {
    try {
        const { url } = req.params;

        if (!url) {
            return res.status(400).json({
                message: "Article URL is required.",
            });
        }

        const storedUrl = FRONTED_URL + "/emerging-evidence/"+url;

        console.log(storedUrl);
        

        EmergingEvidence.getArticleByUrl(storedUrl, function (err, article) {
            if (err) {
                throw err;
            }

            if (!article) {
                return res.status(404).json({
                    message: "Article not found.",
                });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: article,
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while fetching the article.",
        });
    }
}

module.exports = getArticleByUrl;