import jwt from "jsonwebtoken";

export function signToken({ id, name, roles = [] }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  const ttl = process.env.TOKEN_TTL || "1h";
  return jwt.sign({ sub: id, name, roles }, secret, { expiresIn: ttl });
}

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" ");
    if (!token) return res.status(401).json({ error: "Missing Bearer token" });

    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
