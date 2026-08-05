/** Browser-side mirror of igpo/advantage/turn_level.py (z-norm + discount). */

function zscore(values, eps = 1e-6) {
  if (!values.length) return [];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);
  if (std < eps) return values.map((v) => v - mean);
  return values.map((v) => (v - mean) / (std + eps));
}

export function discountedTurnAdvantages(normalized, gamma = 0.95) {
  const n = normalized.length;
  const adv = Array(n).fill(0);
  let running = 0;
  for (let t = n - 1; t >= 0; t -= 1) {
    running = normalized[t] + gamma * running;
    adv[t] = running;
  }
  return adv;
}

/**
 * @param {Array<{ infoGains: number[], outcome: number }>} trajectories
 * @param {{ gamma?: number, normMode?: 'separate' | 'joint', outcomeOnly?: boolean }} opts
 */
export function computeGroupAdvantages(
  trajectories,
  { gamma = 0.95, normMode = "separate", outcomeOnly = false } = {},
) {
  if (outcomeOnly) {
    const outcomes = trajectories.map((t) => t.outcome);
    const normed = zscore(outcomes);
    return trajectories.map((_, i) => ({
      normalized: [normed[i]],
      advantages: [normed[i]],
      collapse: Math.abs(normed[i]) < 1e-9,
    }));
  }

  let normalizedList;

  if (normMode === "joint") {
    const pool = trajectories.flatMap((t) => [...t.infoGains, t.outcome]);
    const normed = zscore(pool);
    let cursor = 0;
    normalizedList = trajectories.map((t) => {
      const n = t.infoGains.length + 1;
      const slice = normed.slice(cursor, cursor + n);
      cursor += n;
      return slice;
    });
  } else {
    const igPool = trajectories.flatMap((t) => t.infoGains);
    const outcomePool = trajectories.map((t) => t.outcome);
    const igNormed = zscore(igPool);
    const outcomeNormed = zscore(outcomePool);
    let igCursor = 0;
    normalizedList = trajectories.map((t, i) => {
      const nIg = t.infoGains.length;
      const piece = nIg ? igNormed.slice(igCursor, igCursor + nIg) : [];
      igCursor += nIg;
      return [...piece, outcomeNormed[i]];
    });
  }

  return normalizedList.map((normalized) => {
    const advantages = discountedTurnAdvantages(normalized, gamma);
    const collapse = advantages.every((a) => Math.abs(a) < 1e-9);
    return { normalized, advantages, collapse };
  });
}

export function groupCollapseRate(results) {
  if (!results.length) return 0;
  return results.filter((r) => r.collapse).length / results.length;
}
