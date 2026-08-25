const User = require("../../models/users");
const { signToken, authCookieOptions } = require("../../middlewares/jsonwebtoken");
const { welcomeEmailService } = require("../../services/welcomeEmailService");
const { JWT_EXPIRY } = require("../../constants");

async function registerUser(req, res){
    try{
        const { username, password, organizationName, country, thematicArea } = req.body;

        if(
            !username || typeof username !== "string" ||
            !password || typeof password !== "string" ||
            !organizationName || typeof organizationName !== "string" ||
            !country || typeof country !== "string" ||
            !thematicArea || typeof thematicArea !== "string"
        ) {
            return res.status(400).json({
                message: "Missing fields required."
            })
        }

        User.getUserByUsername(username, function(err, user){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            if(user){
                return res.status(400).json({
                    message: "A user already exists with that email"
                })
            }

            // role is intentionally not accepted from the request body - every
            // self-registered account is a plain "user"; admin/super-admin is only
            // ever granted out-of-band.
            const body = {
                username: username,
                password: password,
                organizationName: organizationName,
                country: country,
                thematicArea: thematicArea
            };

            const newUser = new User(body);

            User.createUser(newUser, function(err, user) {
                if(err){
                    console.error(err);
                    return res.status(500).json({ message: "Internal server error" });
                }

                user.password = undefined;
                delete user.password;

                const token = signToken({ uid: user._id, role: user.role }, JWT_EXPIRY);

                res.cookie("_wits_session-id", token, authCookieOptions(24 * 60 * 60 * 1000 * 7));
                res.cookie("_wits-user-id", String(user._id), authCookieOptions(24 * 60 * 60 * 1000 * 7));

                res.status(200).json({
                    message: "Request executed successfully",
                    data: user,
                    token
                });

                // email service here (left disabled - unrelated to the security pass;
                // enable deliberately once NODEMAILER_CONFIG/SENDGRID is wired up)
                //welcomeEmailService({name:user.name, email: user.username})
            })
        })

    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = registerUser;
