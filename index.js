require("dotenv").config(); // secure variables
const app = require("./utils/app");
const { authRateLimiter } = require("./utils/app");
const mongo = require('./utils/mongo') // MongoDB (database)
const {PORT} = require('./constants')

// REST Routes - trimmed to only what the frontend (ahp-client) actually consumes.
// Removed: /admins, /whitelist, /cases, /incidents, /offenders, /performance,
// /geocode (no frontend consumer at all) and the GraphQL endpoint (unused dummy
// resolvers - the frontend never calls it).
const users = require("./routes/users");
const AHPComparison = require("./routes/ahp-comparisons");

const blogs = require("./routes/blogs");
const articles = require("./routes/articles");

const tweets = require("./routes/tweets");
const llm = require("./routes/llm");

const partnerLogo = require("./routes/partnerLogos");

async function startServer() {
  await mongo.connect();

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello world, Welcome to WITs" })
  });

  // Auth-specific rate limiting: login/sign-up endpoints get a tight per-IP cap on
  // top of the global slow-down, since they were previously unprotected against
  // credential-stuffing / brute-force / registration-spam.
  app.use(["/users/login", "/users/sign-up"], authRateLimiter);

  app.use("/users", users);
  app.use("/ahp", AHPComparison);
  app.use("/blogs", blogs);
  app.use("/articles", articles);
  app.use("/tweets", tweets);
  app.use("/llm", llm);

  app.use("/logos", partnerLogo);

  // 404 for anything that didn't match a route, instead of falling through to
  // Express's default HTML 404 page (which echoes the request path back unescaped
  // and reveals the Express/stack details in non-production).
  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  // Error handler must be registered last (after all routes) so it actually catches
  // errors thrown by route handlers - previously this middleware was added before any
  // route existed, so it never ran for real request errors. It also no longer leaks
  // raw error objects/stack traces to the client.
  app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({ message: "Internal server error" });
  });

  app.listen(PORT, () => {
    console.log(`REST Server running at http://localhost:${PORT}`);
  });
}

startServer();
