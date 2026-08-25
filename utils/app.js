const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const { ORIGIN } = require("../constants");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();

// We sit behind Dokploy's reverse proxy in production, so Express needs to trust the
// X-Forwarded-* headers to see real client IPs (rate limiting) and know the original
// request was HTTPS (secure cookies). app.enable("proxy true") previously set a
// meaningless setting named literally "proxy true" and did nothing - this is the
// actual API for it.
app.set('trust proxy', 1);

// Security headers first, so every response - including error responses - gets them.
app.use(helmet());

app.use(cookieParser());

// CORS: origin is a fixed allow-list (see constants/index.js) so only the real
// frontend can make credentialed requests; unrecognized origins are rejected.
app.use(cors({ credentials: true, origin: ORIGIN, optionsSuccessStatus: 200 }))

// Body size limits: previously 50mb/200mb (including an unused raw text/plain parser),
// which is a large unauthenticated-payload DoS surface for an API that only ever
// exchanges JSON metadata (images/files are referenced by URL, not embedded).
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true, parameterLimit: 1000 }));

// General slow-down applied to all requests. windowMs was previously
// `15 * 60 * 100` (1.5 minutes) despite the comment saying 15 minutes.
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 300,
    delayMs: () => 500
});
app.use(speedLimiter);

// Stricter limiter specifically for authentication endpoints (login/sign-up), which
// previously had no brute-force protection at all beyond the very loose global
// slow-down above. Keyed by IP; deliberately tight since these are low-volume,
// high-value targets for credential stuffing / account enumeration.
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Please try again later." }
});

// Narrow limiter for endpoints that call paid/rate-limited third-party APIs
// (Anthropic, Mapbox) so an anonymous or low-effort script can't run up billing.
const externalApiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." }
});

module.exports = app;
module.exports.authRateLimiter = authRateLimiter;
module.exports.externalApiRateLimiter = externalApiRateLimiter;
