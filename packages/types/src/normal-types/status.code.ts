// --- 2xx Success ---
export const OK = 200;
export const CREATED = 201;
export const NO_CONTENT = 204;

// --- 3xx Redirects ---
export const NOT_MODIFIED = 304;

// --- 4xx Client Errors ---
export const BAD_REQUEST = 400;            // Invalid input (missing fields, bad format)
export const UNAUTHORIZED = 401;           // Not logged in / invalid token
export const FORBIDDEN = 403;              // Logged in but not allowed
export const NOT_FOUND = 404;              // Resource not found
export const CONFLICT = 409;               // Duplicate user / version conflict
export const UNPROCESSABLE_ENTITY = 422;   // Validation error (form inputs invalid)
// --- 5xx Server Errors ---
export const INTERNAL_SERVER_ERROR = 500;
export const SERVICE_UNAVAILABLE = 503;
