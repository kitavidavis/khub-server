const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
    tweetId: {
        type: String,
        required: true,
        index: true
    },
    associatedOrganization: {
        type: String,
        required: true
    },
    associatedOrganizationId: {
        type: String,
        required: true
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
}, { timestamps: true });

const Tweet = module.exports = mongoose.model("tweets", TweetSchema);

module.exports.createTweet = function(newTweet, cb){
    newTweet.save(cb);
};

module.exports.getAllFeeds = function(cb){
    Tweet.find({}).sort({ createdAt: -1 }).exec(cb);
}

module.exports.getUserFeeds = function(id, cb){
    Tweet.find({ associatedOrganizationId: id }).sort({ createdAt: -1 }).exec(cb);
}

module.exports.removeFeed = function(feedId, cb){
    Tweet.findByIdAndDelete(feedId, cb);
}