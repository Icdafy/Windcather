'use strict';
// 计分公式 —— 纯代码、可控可调（参数在 config/scoring.json）
// 质量分 = Σ(维度权重 × 维度分) × 信源等级系数
// 展示热度 = 质量分 × 时间衰减（半衰期可调，「随时间消退」）

function computeQuality(scores, tier, scoring) {
  const w = scoring.dimensionWeights;
  let s = 0;
  for (const k of Object.keys(w)) s += (Number(scores[k]) || 0) * w[k];
  const mult = scoring.tierMultiplier[tier] ?? 1.0;
  return Math.round(Math.min(100, s * mult) * 10) / 10;
}

function isFeatured(quality, category, scoring, heuristic = false) {
  let th = scoring.featuredThresholds[category] ?? scoring.featuredThresholds.default;
  // 启发式降级模式分数天花板低，阈值同步打折，保证无 API Key 时精选页也有内容
  if (heuristic) th *= scoring.heuristicThresholdDiscount ?? 0.85;
  return quality >= th;
}

function heatScore(quality, publishedAt, scoring, nowMs = Date.now()) {
  const t = publishedAt ? new Date(publishedAt).getTime() : nowMs;
  const hours = Math.max(0, (nowMs - t) / 3600e3);
  const halfLife = scoring.heatDecayHalfLifeHours || 36;
  return quality * Math.pow(0.5, hours / halfLife);
}

module.exports = { computeQuality, isFeatured, heatScore };
