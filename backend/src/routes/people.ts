import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { authenticate } from "../middleware/auth";
import { getDataProvider } from "../providers";
import { safeAuditQuery } from "../utils/normalize";

const router = Router();

const searchSchema = z.object({
  name: z.string().min(2),
  city: z.string().optional(),
  purpose: z.enum(["atendimento_publico", "validacao_cadastral", "analise_operacional"])
});

router.post("/search", authenticate, async (req, res, next) => {
  try {
    const data = searchSchema.parse(req.body);
    const matches = await getDataProvider().searchPeople({
      name: data.name,
      city: data.city
    });

    const audit = await prisma.searchAudit.create({
      data: {
        userId: req.user!.sub,
        query: safeAuditQuery(data.name),
        purpose: data.purpose,
        resultCount: matches.length,
        ipAddress: req.ip
      }
    });

    return res.json({
      queryId: audit.id,
      matches
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
