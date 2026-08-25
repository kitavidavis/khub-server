const mongoose = require("mongoose");
const { sanitizeUpdate } = require('../utils/sanitizeUpdate');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
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
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
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
    }
}, { timestamps: true});

const Blog = module.exports = mongoose.model("blogs", BlogSchema);

module.exports.createBlog = function(newBlog, cb){
    newBlog.save(cb);
}

module.exports.getBlogByUrl = function(url, cb){
    Blog.findOne({ url: url }, cb);
}

module.exports.getBlogsByUserId = function(id, cb){
    Blog.find({ writtenBy: id }).sort({ createdAt: -1 }).exec(cb);
}

module.exports.getApprovedBlogs = function(cb){
    Blog.find({ approved: true }).sort({ updatedAt: -1 }).exec(cb);
}

module.exports.getUnapprovedBlogs = function(cb){
    Blog.find({ approved: false }, cb);
}

module.exports.updateBlog = function(id, updatedBlog, cb){
    // See utils/sanitizeUpdate - writtenBy/url/_id are deliberately excluded so a
    // caller can't reassign authorship or the canonical URL through this endpoint.
    const safeUpdate = sanitizeUpdate(updatedBlog, [
        "title", "content", "featureImage", "description", "category", "tags",
        "approved", "deleted", "comments", "likes", "views"
    ]);
    Blog.findByIdAndUpdate(id, { $set: safeUpdate }, { new: true, runValidators: true }, cb);
}