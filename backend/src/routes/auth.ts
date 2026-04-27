import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { env } from "../config/env";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  agencyName: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function publicUser(user: { id: string; name: string; email: string; role: string; agencyName: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    agencyName: user.agencyName
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });

    if (exists) {
      return res.status(409).json({ message: "E-mail ja cadastrado" });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        agencyName: data.agencyName,
        role: "ADMIN"
      }
    });

    const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "8h" });
    return res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return res.status(401).json({ message: "Credenciais invalidas" });
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
