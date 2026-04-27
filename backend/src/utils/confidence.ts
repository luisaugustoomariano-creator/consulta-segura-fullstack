export function calculateConfidence(query: string, target: string, sameCity: boolean): number {
  if (!query || !target) return 0;

  const queryTokens = query.split(" ").filter(Boolean);
  const targetTokens = target.split(" ").filter(Boolean);
  const matchingTokens = queryTokens.filter((token) =>
    targetTokens.some((targetToken) => targetToken === token || targetToken.startsWith(token))
  );

  let score = 45;

  if (target === query) score += 45;
  else if (target.startsWith(query)) score += 30;
  else if (target.includes(query)) score += 22;

  score += Math.round((matchingTokens.length / Math.max(queryTokens.length, 1)) * 20);
  if (sameCity) score += 10;

  return Math.min(score, 99);
}
