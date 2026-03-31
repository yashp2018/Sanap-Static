const session      = require("express-session");
const pgSession    = require("connect-pg-simple")(session);
const pool         = require("../db");

const sessionMiddleware = session({
  store: new pgSession({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,   // auto-creates the sessions table
  }),
  secret:            process.env.SESSION_SECRET || "change_me",
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});

module.exports = sessionMiddleware;
