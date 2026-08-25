const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    thematicArea: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    country: {
        type: String,
        default: "Kenya"
    },
    role: {
        // "super-admin" added to match the role check already present in the
        // frontend (state.userData?.role === "super-admin"), which the schema
        // previously made impossible to ever assign.
        type: String,
        enum: ["admin", "user", "super-admin"],
        default: "user"
    },
}, { timestamps: true});

const User = module.exports = mongoose.model("users", UserSchema);

module.exports.createUser = function(newUser, cb){
    bcrypt.genSalt(10, function(err, salt) {
        if(err){
            throw err;
        }

        bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err){
                throw err;
            }

            newUser.password = hash;
            newUser.save(cb);
        })
    })
}

module.exports.getUserById = function(id, cb){
    User.findById(id).select("-password").exec(cb);
}

module.exports.getUserByUsername = function(username, cb){
    User.findOne({ username: username }, cb);
}

module.exports.comparePassword = function(candidatePassword, hash, cb){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err){
            throw err;
        }

        cb(null, isMatch);
    })
}

/**
 * NOTE: add serverside pagination
 * @param {*} cb
 */
module.exports.getAllUsers = function(cb){
    // Password hashes were previously returned to any caller (this route had no
    // auth check at all) - excluded here at the query layer as well as behind
    // auth/role checks at the route, so nothing can accidentally return it again.
    User.find({}).select("-password").exec(cb);
}