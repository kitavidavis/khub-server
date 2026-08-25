/**
 * Several endpoints accept a free-form `update` object from the client and pass it
 * straight into Mongoose's findByIdAndUpdate(id, update, ...). That has two problems:
 *
 * 1. Operator injection: MongoDB update documents let a caller supply operators like
 *    $set/$unset/$rename/$push at the top level. A client could send
 *    { "$unset": { "deleted": "" } } or similar and it would be executed verbatim.
 * 2. Mass assignment / replacement semantics: an update object with no operator keys
 *    is treated by MongoDB as a full document *replacement*, not a partial update -
 *    so a caller sending only { status: "Closed" } would silently wipe every other
 *    field on the document. It also lets a caller overwrite fields it never should
 *    (e.g. ownership fields, _id, timestamps).
 *
 * sanitizeUpdate() picks only the explicitly allowed fields out of the raw input,
 * drops anything else (including any $-prefixed operator keys), and returns a proper
 * { $set: {...} } document so partial updates stay partial.
 */
function sanitizeUpdate(rawUpdate, allowedFields) {
    const safe = {};

    if (!rawUpdate || typeof rawUpdate !== "object" || Array.isArray(rawUpdate)) {
        return safe;
    }

    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(rawUpdate, field)) {
            safe[field] = rawUpdate[field];
        }
    }

    return safe;
}

module.exports = { sanitizeUpdate };
