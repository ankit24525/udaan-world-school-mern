import jwt from "jsonwebtoken";

export function getUser(req, res, next) {
  try {
    if (!req.cookies) return next();

    const token = req.cookies.user;

    if (!token) return next();

    const decoded = jwt.verify(token, "secret123");

    req.user = decoded; // { email }

    next();
  } catch (err) {
    next(); // never crash server
  }
}