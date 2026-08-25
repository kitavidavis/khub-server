const mongoose = require("mongoose");

const AHPComparisonsSchema = new mongoose.Schema({
    comparisons: {
        type: {},
        required: true
    },
    consistency: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const AHP = module.exports = mongoose.model("ahp-comparisons", AHPComparisonsSchema);

// createComparison/updateComparison/getComparisonById/deleteComparison were removed -
// they only backed the create-submissions endpoint, which has no frontend consumer.
// Only the read path the dashboard actually uses remains.

module.exports.getComparisonsByUser = function(user, cb){
    AHP.find({ user: user }, cb);
}

module.exports.getAllComparisons = function(cb) {
    AHP.find({ }, cb);
}
