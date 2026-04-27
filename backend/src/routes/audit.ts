import { Router } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.get("/searches", authenticate, requireRole([UserRole.ADMIN, UserRole.AUDITOR]), async (_req, res, next) => {
  try {
    const searches = await prisma.searchAudit.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return res.json(
      searches.map((search) => ({
        id: search.id,
        user: search.user,
        query: search.query,
        purpose: search.purpose,
        resultCount: search.resultCount,
        ipAddress: search.ipAddress,
        createdAt: search.createdAt
      }))
    );
  } catch (error) {
    return next(error);
  }
});

export default router;
