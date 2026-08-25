const express = require("express");
const rateLimit = require("express-rate-limit");
const { createPartnerLogo, getPartnerLogos } = require("../controllers/partnerLogos/api");

const router = express.Router();

// Public (called pre-auth during org self-registration) but rate-limited, since an
// unauthenticated create endpoint is otherwise an easy spam/flood target.
const createLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." }
});

router.post("/create", [createLimiter], createPartnerLogo);

router.get("/logos", [], getPartnerLogos);

module.exports = router;
