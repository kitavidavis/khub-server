const mongoose = require("mongoose");
const { sanitizeUpdate } = require('../utils/sanitizeUpdate');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    featureImage: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        required: false
    },
    writtenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    url: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    comments: {
        type: [Object],
        required: false
    },
    likes: {
        type: [String],
        required: false
    },
    views: {
        type: Number,
        default: 0
    },
    newAttributes: {
        type: Object
    }
}, { timestamps: true});

const EmergingEvidence = module.exports = mongoose.model("emergingEvidence", ArticleSchema);

module.exports.createArticle = function(newEmergingEvidence, cb){
    newEmergingEvidence.save(cb);
}

module.exports.getArticleByUrl = function(url, cb){
    EmergingEvidence.findOne({ url: url }, cb);
}

module.exports.getArticlesByUserId = function(id, cb){
    EmergingEvidence.find({ writtenBy: id }).sort({ createdAt: -1 }).exec(cb);
}

module.exports.getApprovedArticles = function(cb){
    EmergingEvidence.find({ approved: true }).sort({ updatedAt: -1 }).exec(cb);
}

module.exports.getUnapprovedArticles = function(cb){
    EmergingEvidence.find({ approved: false }).sort({ createdAt: -1 }).exec(cb);
}

module.exports.updateArticle = function(id, updatedEmergingEvidence, cb){
    // See utils/sanitizeUpdate - writtenBy/url/_id are deliberately excluded.
    const safeUpdate = sanitizeUpdate(updatedEmergingEvidence, [
        "title", "content", "featureImage", "description", "category", "tags",
        "approved", "deleted", "comments", "likes", "views", "newAttributes"
    ]);
    EmergingEvidence.findByIdAndUpdate(id, { $set: safeUpdate }, { new: true, runValidators: true }, cb);
}