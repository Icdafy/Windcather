'use strict';
// 公开 API 适配器 —— 当前支持：东方财富关键词搜索（kind: eastmoney）
// url 字段约定为 "eastmoney://关键词"，后续接入其他 JSON API 在此扩展
const { fetchText } = require('./fetch-util');

async function fetch(source, settings) {
  if (source.url.startsWith('eastmoney://')) {
    const keyword = decodeURIComponent(source.url.replace('eastmoney://', ''));
    return fetchEastmoney(keyword, settings);
  }
  throw new Error('未知 API 信源格式: ' + source.url);
}

async function fetchEastmoney(keyword, settings) {
  const param = {
    uid: '', keyword, type: ['cmsArticleWebOld'],
    client: 'web', clientType: 'web', clientVersion: 'curr',
    param: { cmsArticleWebOld: { searchScope: 'default', sort: 'time', pageIndex: 1, pageSize: 30, preTag: '', postTag: '' } }
  };
  const url = 'https://search-api-web.eastmoney.com/search/jsonp?cb=cb&param=' +
    encodeURIComponent(JSON.stringify(param));
  const raw = await fetchText(url, settings);
  const body = raw.replace(/^[^(]*\(/, '').replace(/\)\s*$/, '');
  const j = JSON.parse(body);
  const arts = j?.result?.cmsArticleWebOld || [];
  return arts.map(a => ({
    title: String(a.title || '').replace(/<[^>]+>/g, '').trim(),
    url: a.url,
    summary: String(a.content || '').replace(/<[^>]+>/g, '').trim(),
    publishedAt: a.date ? new Date(a.date.replace(' ', 'T') + '+08:00').toISOString() : null,
    image: (a.image && /^https?:\/\//.test(a.image)) ? a.image : null
  })).filter(a => a.title && a.url);
}

module.exports = { fetch };
