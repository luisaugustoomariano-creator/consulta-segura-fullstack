import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter pelo menos 16 caracteres"),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  DATA_PROVIDER_MODE: z.enum(["simulated", "authorized_api"]).default("simulated"),
  AUTHORIZED_PROVIDER_URL: z.string().url().optional().or(z.literal("")),
  AUTHORIZED_PROVIDER_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
