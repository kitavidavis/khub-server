const mongoose = require("mongoose");

const PartnerLogoSchema = new mongoose.Schema({
    partnerName: {
        type: String,
        index: true
    },
    imagePath: {
        type: String
    },
    partnerURL: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
}, { timestamps: true });

const PartnerLogo = module.exports = mongoose.model("partnerLogos", PartnerLogoSchema);

module.exports.createPartnerLogo = function(newPartnerLogo, cb){
    newPartnerLogo.save(cb);
}

module.exports.getAllPartnerLogos = function(cb){
    PartnerLogo.find({}, cb);
}