import { prisma } from "../config/prisma";
import { calculateConfidence } from "../utils/confidence";
import { normalizeName } from "../utils/normalize";
import { DataProvider } from "./types";

export const simulatedProvider: DataProvider = {
  async searchPeople(input) {
    const normalizedQuery = normalizeName(input.name);
    const normalizedCity = input.city ? normalizeName(input.city) : null;
    const tokens = normalizedQuery.split(" ").filter(Boolean);

    const people = await prisma.person.findMany({
      where: {
        OR: [
          { normalizedName: { contains: normalizedQuery, mode: "insensitive" } },
          ...tokens.map((token) => ({ normalizedName: { contains: token, mode: "insensitive" as const } }))
        ]
      },
      take: 50
    });

    return people
      .map((person) => {
        const sameCity = normalizedCity ? normalizeName(person.city) === normalizedCity : false;
        return {
          id: person.id,
          fullName: person.fullName,
          city: person.city,
          state: person.state,
          company: person.company,
          role: person.role,
          documentMasked: person.documentMasked,
          emailMasked: person.emailMasked,
          phoneMasked: person.phoneMasked,
          motherName: person.motherName,
          fatherName: person.fatherName,
          sourceName: person.sourceName,
          confidenceScore: calculateConfidence(normalizedQuery, person.normalizedName, sameCity)
        };
      })
      .filter((item) => item.confidenceScore >= 55)
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, 10);
  }
};
