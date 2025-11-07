import { Router } from "express";
import bcrypt from "bcryptjs";
import { signToken, requireAuth } from "../middleware/jwt.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const demoUser = process.env.AUTH_USER;
  const demoHash = process.env.AUTH_PASS_HASH;
  if (!demoUser || !demoHash) {
    return res
      .status(500)
      .json({ error: "Auth is not configured (AUTH_USER / AUTH_PASS_HASH missing)" });
  }

  const okUser = username === demoUser;
  const okPass = await bcrypt.compare(password, demoHash);

  if (!okUser || !okPass) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ id: demoUser, name: demoUser, roles: ["user"] });
  return res.status(200).json({ token });
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
