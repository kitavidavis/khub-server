const EmergingEvidence = require("../../models/emerging-evidence");
const { FRONTED_URL } = require("../../constants");

async function createEmergingEvidence(req, res) {
    try {
        const { title, content, featureImage, description, category, tags, newAttributes } = req.body;

        if (!title || typeof title !== "string") {
            return res.status(400).json({
                message: "Title is required.",
            });
        }

        const body = {
            title,
            content,
            featureImage,
            description,
            category,
            tags,
            // writtenBy now always comes from the authenticated token, not the
            // request body - previously a caller could attribute an article to any
            // arbitrary user id.
            writtenBy: req.auth.uid,
            url: FRONTED_URL + "/emerging-evidence/" + title.replace(/\s+/g, "-").toLowerCase(),
            newAttributes
        };

        const newEmergingEvidence = new EmergingEvidence(body);

        EmergingEvidence.createArticle(newEmergingEvidence, function (err, article) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while creating the article." });
            }

            res.status(200).json({
                message: "Request executed successfully",
                data: article,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while creating the article.",
        });
    }
}

module.exports = createEmergingEvidence;
