const User = require("../../models/users");
const { signToken, authCookieOptions } = require("../../middlewares/jsonwebtoken");
const { JWT_EXPIRY } = require("../../constants");

async function Login(req, res) {
    try{
        const { username, password } = req.body;

        if(!username || typeof username !== "string" || !password || typeof password !== "string"){
            return res.status(400).json({message: "Missing fields required"});
        }

        User.getUserByUsername(username, function(err, user){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            if(user){
                User.comparePassword(password, user.password, function(err, isMatch){
                    if(err){
                        console.error(err);
                        return res.status(500).json({ message: "Internal server error" });
                    }

                    if(isMatch){
                        user.password = undefined;
                        delete user.password;

                        // role is included so role-gated endpoints work off the token
                        // itself instead of trusting anything client-supplied.
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
                            message: "Invalid login credentials"
                        })
                    }
                })
            } else {
                return res.status(400).json({
                    message: "Invalid login credentials!"
                })
            }
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = Login;
