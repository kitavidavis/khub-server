const jwt = require('jsonwebtoken')
const { JWT_SECRET, IS_PRODUCTION } = require('../constants')

const signToken = (payload = {}, expiresIn = '1d') => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn })

  return token
}

// Cookies set by the login/register/login-with-token controllers. Kept in one place
// so every controller that issues a session uses the same (correct) flags instead of
// each hand-rolling res.cookie(...) with inconsistent security attributes.
// SameSite=None is required for the cookie to be sent on the cross-origin requests the
// SPA makes (frontend and backend live on different domains); SameSite=None is only
// honored by browsers when Secure is also set, so both must travel together.
const authCookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? 'None' : 'Lax',
  maxAge: maxAgeMs,
})

// Pull a bearer token from the Authorization header, falling back to the httpOnly
// session cookies set at login. The frontend already sends both (withCredentials is
// on globally) so this lets us require auth on endpoints the frontend never bothered
// to attach an Authorization header for, without touching the frontend.
const extractToken = (request) => {
  const headerToken = request.headers.authorization?.split(' ')[1]
  if (headerToken) return headerToken

  const cookies = request.cookies || {}
  return cookies['session-id'] || cookies['_wits_session-id'] || null
}

const authorizeBearerToken = (request, response, next) => {
  try {
    const token = extractToken(request)
    if (!token) {
      return response.status(401).json({
        message: 'Unauthorized - authentication required',
      })
    }

    const auth = jwt.verify(token, JWT_SECRET)
    if (!auth) {
      return response.status(401).json({
        message: 'Unauthorized - invalid token',
      })
    }

    request.auth = auth
    next()
  } catch (error) {
    return response.status(401).json({
      message: 'Unauthorized - invalid token',
    })
  }
}

// Role/ownership helpers. Use after authorizeBearerToken.

// Restricts access to the given roles (e.g. requireRole('admin', 'super-admin')).
const requireRole = (...roles) => (request, response, next) => {
  if (!request.auth) {
    return response.status(401).json({ message: 'Unauthorized - authentication required' })
  }

  if (!roles.includes(request.auth.role)) {
    return response.status(403).json({ message: 'Forbidden - insufficient privileges' })
  }

  next()
}

// Allows the request through if the authenticated user owns the resource
// (req.params[paramName] === req.auth.uid) OR holds one of the given roles.
// Prevents IDOR on "my own records" endpoints while still letting admins through.
const requireOwnerOrRole = (paramName, ...roles) => (request, response, next) => {
  if (!request.auth) {
    return response.status(401).json({ message: 'Unauthorized - authentication required' })
  }

  const targetId = request.params[paramName]
  if (request.auth.uid === targetId || roles.includes(request.auth.role)) {
    return next()
  }

  return response.status(403).json({ message: 'Forbidden - insufficient privileges' })
}

module.exports = {
  authorizeBearerToken,
  signToken,
  authCookieOptions,
  requireRole,
  requireOwnerOrRole,
}
