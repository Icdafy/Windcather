'use strict';
// 抓取工具：带 UA / 超时 / 编码识别（GBK 政府网站友好）
const iconv = require('iconv-lite');

async function fetchText(url, settings) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), settings.collect.requestTimeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': settings.collect.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      },
      redirect: 'follow',
      signal: ctrl.signal
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    return decodeBuffer(buf, res.headers.get('content-type') || '');
  } finally {
    clearTimeout(timer);
  }
}

function decodeBuffer(buf, contentType) {
  let charset = (contentType.match(/charset=([\w-]+)/i) || [])[1];
  if (!charset) {
    // 在头部嗅探 <meta charset> / xml encoding
    const head = buf.slice(0, 2048).toString('ascii');
    charset = (head.match(/charset=["']?([\w-]+)/i) || head.match(/encoding=["']([\w-]+)/i) || [])[1];
  }
  charset = (charset || 'utf-8').toLowerCase();
  if (charset === 'gb2312' || charset === 'gbk' || charset === 'gb18030') {
    return iconv.decode(buf, 'gb18030');
  }
  return buf.toString('utf8');
}

module.exports = { fetchText };
