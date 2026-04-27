import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";

type JwtPayload = {
  sub: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token ausente" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido" });
  }
}

export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    return next();
  };
}
