const AHPComparison = require("../../models/ahp-comparisons");

async function fetchComparisons(req, res){
    try{
        // "admin view all" is now driven by the verified role on the token, not by
        // a client-supplied `isAdmin` query param - previously anyone could pass
        // ?isAdmin=1 and dump every user's AHP submissions.
        const isAdmin = req.auth.role === "admin" || req.auth.role === "super-admin";

        if(isAdmin){
            AHPComparison.getAllComparisons(function(err, data){
                if(err){
                    console.error(err);
                    return res.status(500).json({ message: "Internal server error." });
                }

                return res.status(200).json({
                    message: "Request executed",
                    data
                });
            });
        } else {
            // Non-admins may only ever see their own submissions, regardless of
            // what `user` query param they pass.
            AHPComparison.getComparisonsByUser(req.auth.uid, function(err, data){
                if(err){
                    console.error(err);
                    return res.status(500).json({ message: "Internal server error." });
                }

                return res.status(200).json({
                    message: "Request executed",
                    data
                });
            })
        }
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal server error."
        })
    }
}

module.exports = fetchComparisons;
