const User = require("../../models/users");

// Public (see routes/users.js) - a live guest page consumes it unauthenticated to
// build an organization directory. It previously also leaked bcrypt password hashes
// to any caller; that part is fixed at the model layer regardless of auth
// (models/users.js .select("-password")), so keeping this open doesn't reopen the
// original finding. Still returns full user documents otherwise (org name, country,
// etc.) - fine for this platform's public directory use case, but worth remembering
// if more sensitive fields are ever added to the User schema.
async function getAllUsers(req, res){
    try{
        User.getAllUsers(function(err, data){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            return res.status(200).send({data: data});
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = getAllUsers;
