'use strict';
// 重置分析标记：让启发式打分/失败/被关键词判无关的条目重新进入 AI 管线
const { db } = require('../server/db');
const r = db.prepare(`UPDATE articles SET analyzed=0, relevant=NULL, featured=0, quality_score=NULL
  WHERE analyzed IN (2,3) OR (analyzed=1 AND relevant=0)`).run();
console.log(`已重置 ${r.changes} 条待重新分析`);
