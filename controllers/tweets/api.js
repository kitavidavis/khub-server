const Tweet = require("../../models/tweets");

// create/delete are admin-only, enforced at the route via [authorizeBearerToken,
// requireRole('admin','super-admin')] (see routes/tweets.js).
async function createTweet(req, res){
    try{
        const { tweetId, associatedOrganization, associatedOrganizationId, latitude, longitude } = req.body;

        if(!tweetId || !associatedOrganization || !associatedOrganizationId){
            return res.status(400).json({ message: "Missing fields required." });
        }

        const newTweet = new Tweet({
            tweetId,
            associatedOrganization,
            associatedOrganizationId,
            latitude,
            longitude
        });

        Tweet.createTweet(newTweet, function(err, data){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            return res.status(200).send({ data: data });
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Public - shown on the guest-facing social media wall.
async function fetchTweets(req, res){
    try{
        Tweet.getAllFeeds(function(err, data){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            return res.status(200).send({ data: data });
        });
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Ownership (or admin) is enforced at the route via requireOwnerOrRole.
async function fetchUserTweets(req, res){
    try{
        const { userId } = req.params;

        Tweet.getUserFeeds(userId, function(err, data){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            return res.status(200).send({ data: data });
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function removeUserTweets(req, res){
    try{
        const { tweetId } = req.params;

        Tweet.removeFeed(tweetId, function(err, done){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            return res.status(200).send({ done: done });
        })
    } catch(error){
        // Was `catch(err)` while referencing the undefined identifier `error` in the
        // body - a ReferenceError that fired on every failure path (e.g. an
        // invalid tweetId), replacing whatever the real error was.
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createTweet,
    fetchTweets,
    fetchUserTweets,
    removeUserTweets
}
