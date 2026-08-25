const express = require("express");
const { authorizeBearerToken } = require("../middlewares/jsonwebtoken");
const loginWithToken = require("../controllers/users/login-with-token");
const Login = require("../controllers/users/login");
const registerUser = require("../controllers/users/register");
const getAllUsers = require("../controllers/users/all-users");

const router = express.Router();

router.get("/login-with-token", [authorizeBearerToken], loginWithToken);

router.post("/login", Login);

router.post("/sign-up", registerUser);

// Public by design - the /stats guest page (pages/Guest/Starts2.tsx via GuestStats)
// calls this with no auth to build an organization-name directory. Password hashes
// are still excluded at the model layer (models/users.js .select("-password")) even
// though this route itself is open, so the original credential-leak finding stays
// fixed regardless of who's allowed to call it.
router.get("/users", [], getAllUsers);

module.exports = router;
