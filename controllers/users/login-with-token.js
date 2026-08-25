const User = require("../../models/users");
const { signToken, authCookieOptions } = require("../../middlewares/jsonwebtoken");
const { JWT_EXPIRY } = require("../../constants");

async function loginWithToken(req, res) {
    try{
        const { uid } = req.auth;

        User.getUserById(uid, function(err, user){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            if(user){
                user.password = undefined;
                delete user.password;

                const token = signToken({ uid: user._id, role: user.role }, JWT_EXPIRY);

                res.cookie("_wits_session-id", token, authCookieOptions(24 * 60 * 60 * 1000 * 7));
                res.cookie("_wits-user-id", String(user._id), authCookieOptions(24 * 60 * 60 * 1000 * 7));

                return res.status(200).json({
                    message: "Request executed successfully.",
                    data: user,
                    token
                });
            } else {
                return res.status(400).json({
                    message: "Your session expired"
                });
            }
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = loginWithToken;
