import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import peopleRoutes from "./routes/people";
import auditRoutes from "./routes/audit";
import { errorHandler } from "./middleware/error";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/people", peopleRoutes);
app.use("/audit", auditRoutes);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT}`);
});
