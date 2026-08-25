const express = require('express');
const { authorizeBearerToken } = require("../middlewares/jsonwebtoken");
const fetchComparisons = require('../controllers/ahp-comparisons/fetchComparisons');

const router = express.Router();

// POST /create-submissions was removed - no frontend consumer calls it (the "new
// comparison" flow was never wired up to a route). Only the read side, which the
// dashboard actively displays, remains.
router.get("/submissions", [authorizeBearerToken], fetchComparisons);

module.exports = router;
