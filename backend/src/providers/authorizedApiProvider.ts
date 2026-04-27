import { DataProvider } from "./types";
import { env } from "../config/env";
import { z } from "zod";

const providerResponseSchema = z.object({
  matches: z
    .array(
      z.object({
        id: z.string(),
        fullName: z.string(),
        city: z.string(),
        state: z.string(),
        company: z.string(),
        role: z.string(),
        documentMasked: z.string(),
        emailMasked: z.string().nullable().optional(),
        phoneMasked: z.string().nullable().optional(),
        motherName: z.string().nullable().optional(),
        fatherName: z.string().nullable().optional(),
        sourceName: z.string(),
        confidenceScore: z.number().int().min(0).max(100)
      })
    )
    .max(10)
});

export const authorizedApiProvider: DataProvider = {
  async searchPeople(input) {
    if (!env.AUTHORIZED_PROVIDER_URL || !env.AUTHORIZED_PROVIDER_API_KEY) {
      throw new Error("AUTHORIZED_PROVIDER_NOT_CONFIGURED");
    }

    const response = await fetch(env.AUTHORIZED_PROVIDER_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.AUTHORIZED_PROVIDER_API_KEY}`
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(`AUTHORIZED_PROVIDER_ERROR:${response.status}`);
    }

    const payload = providerResponseSchema.parse(await response.json());
    return payload.matches;
  }
};
