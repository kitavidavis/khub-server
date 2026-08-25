const PartnerLogo = require("../../models/partnerLogos");

// This endpoint is intentionally public - it's called during organization
// self-registration (see RegistrationForm.tsx), before the caller has a token.
// It previously did `new PartnerLogo(req.body)` with the entire raw request body,
// which is a mass-assignment / NoSQL-injection surface (a caller could pass any
// field, including non-schema fields or nested operator objects, straight into a
// Mongoose document). Now every field is explicitly type/shape-checked first.
function isHttpUrl(value) {
    if (typeof value !== "string" || value.length > 2048) return false;
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

async function createPartnerLogo(req, res){
    try{
        const { partnerName, imagePath, partnerURL, latitude, longitude } = req.body;

        if(!partnerName || typeof partnerName !== "string" || partnerName.length > 200){
            return res.status(400).json({ message: "A valid partnerName is required." });
        }

        if(!imagePath || !isHttpUrl(imagePath)){
            return res.status(400).json({ message: "A valid imagePath URL is required." });
        }

        if(partnerURL !== undefined && partnerURL !== "" && !isHttpUrl(partnerURL)){
            return res.status(400).json({ message: "partnerURL must be a valid URL." });
        }

        if(latitude !== undefined && typeof latitude !== "number"){
            return res.status(400).json({ message: "latitude must be a number." });
        }

        if(longitude !== undefined && typeof longitude !== "number"){
            return res.status(400).json({ message: "longitude must be a number." });
        }

        const body = { partnerName, imagePath, partnerURL, latitude, longitude };

        PartnerLogo.createPartnerLogo(new PartnerLogo(body), function(err, data){
            if(err){
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

            return res.status(200).send({ message: "Request executed successfully" })
        });
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getPartnerLogos(req, res){
    try{
        PartnerLogo.getAllPartnerLogos(function(err, data){
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

module.exports = {
    createPartnerLogo,
    getPartnerLogos
}
