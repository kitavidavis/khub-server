const express = require('express');
const { authorizeBearerToken, requireRole, requireOwnerOrRole } = require("../middlewares/jsonwebtoken");
const createEmergingEvidence = require('../controllers/emerging-evidence/create');
const getApprovedArticles = require('../controllers/emerging-evidence/getApprovedArticles');
const getUserArticles = require('../controllers/emerging-evidence/getUserArticles');
const getArticleByUrl = require('../controllers/emerging-evidence/getArticleByUrl');
const getUnapprovedArticles = require('../controllers/emerging-evidence/getUnapprovedArticles');
const approveArticle = require('../controllers/emerging-evidence/approve');

const router = express.Router();

// Was mounted with [] (no auth) despite the frontend already sending a Bearer token
// for this call - now actually enforced.
router.post('/create', [authorizeBearerToken], createEmergingEvidence);

// Public site content.
router.get('/approved', [], getApprovedArticles);
router.get("/get-by-url/:url", [], getArticleByUrl);

// Admin-only moderation views/actions - previously reachable with no auth at all.
router.get('/unapproved', [authorizeBearerToken, requireRole("admin", "super-admin")], getUnapprovedArticles);
router.post("/approve", [authorizeBearerToken, requireRole("admin", "super-admin")], approveArticle);

// A logged-in user's own articles, or an admin viewing anyone's.
router.get("/:userId", [authorizeBearerToken, requireOwnerOrRole("userId", "admin", "super-admin")], getUserArticles);

module.exports = router;
