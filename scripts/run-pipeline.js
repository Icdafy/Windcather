'use strict';
// 手动跑一轮完整管线（采集 → 分析 → 聚类 → 日报），用于验证与调试
const { runPipeline } = require('../server/scheduler');
const { generateDaily } = require('../server/ai/daily');
const { db } = require('../server/db');

(async () => {
  const r = await runPipeline('manual-script');
  console.log('\n=== 管线结果 ===');
  console.log(JSON.stringify(r, null, 2));
  const daily = generateDaily();
  console.log(`日报：${daily.total} 条精选，${daily.sections.length} 个版块`);
  const top = db.prepare(`
    SELECT a.title, a.quality_score, a.category, a.domain, a.featured, s.name src
    FROM articles a JOIN sources s ON s.id=a.source_id
    WHERE a.relevant=1 ORDER BY a.quality_score DESC LIMIT 12`).all();
  console.log('\n=== 质量分 Top12 ===');
  for (const t of top) {
    console.log(`${String(t.quality_score).padStart(5)} ${t.featured ? '★' : ' '} [${t.category}|${t.domain}] ${t.title.slice(0, 50)}  ←${t.src}`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
