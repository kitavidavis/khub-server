const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Only real, known frontend origins are trusted. A bare "*" is dead weight when
// credentials:true is set (browsers/cors never match it against a real Origin header)
// and gives a false sense of "everything is allowed" - removed rather than kept as noise.
const ORIGIN = [
    "http://localhost:3000",
    "https://knowledgehub.institutechildstudies.org",
    "https://www.knowledgehub.institutechildstudies.org"
]

const PORT = process.env.PORT || 4000

// Use the production Mongo URI in production, local URI otherwise, instead of
// always reading MONGODB_LOCAL_URI regardless of environment.
const MONGO_URI = IS_PRODUCTION
    ? (process.env.MONGODB_PROD_URI || process.env.MONGODB_LOCAL_URI)
    : (process.env.MONGODB_LOCAL_URI || process.env.MONGODB_PROD_URI);

const MONGO_OPTIONS = {
  maxPoolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Fail fast instead of silently signing tokens with a well-known default secret.
// In production a missing JWT_SECRET is a deploy-blocking misconfiguration, not
// something to paper over - that default would let anyone forge valid tokens.
if (!process.env.JWT_SECRET) {
    if (IS_PRODUCTION) {
        throw new Error("JWT_SECRET is not set. Refusing to start in production without it.");
    } else {
        console.warn("WARNING: JWT_SECRET is not set. Using an insecure development-only default.");
    }
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-do-not-use-in-production';

const NODEMAILER_CONFIG = process.env.NODEMAILER_CONFIG;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";

const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

// Was hardcoded to a stale vercel.app domain from an earlier deployment, which meant
// every generated blog/article canonical URL silently pointed at the wrong site.
// Now env-driven with the real production domain as the default.
const FRONTED_URL = process.env.FRONTEND_URL || "https://knowledgehub.institutechildstudies.org";

module.exports = {
    IS_PRODUCTION,
    ORIGIN,
    PORT,
    MONGO_URI,
    MONGO_OPTIONS,
    JWT_SECRET,
    NODEMAILER_CONFIG,
    SENDGRID_API_KEY,
    JWT_EXPIRY,
    FRONTED_URL
};
