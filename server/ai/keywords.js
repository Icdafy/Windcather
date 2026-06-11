'use strict';
// 关键词库 —— 双重用途：① 无 API Key 时的启发式相关性判定与打分降级
//                     ② 有 API Key 时作为预筛前的粗过滤，减少送往模型的无关条目，省钱
// （学习 AIHOT 的「能用脚本就别用模型」原则）

const LOWALTITUDE = [
  '低空经济', '低空空域', '低空飞行', '低空智联', '低空基建',
  'eVTOL', '电动垂直起降', '飞行汽车', '空中出租', '空中交通',
  '无人机', '无人驾驶航空', '通用航空', '通航', '直升机',
  '亿航', '峰飞', '沃飞长空', '小鹏汇天', '时的科技', '御风未来', '览翌', '零重力飞机',
  '大疆', '极飞', '纵横股份', '中无人机',
  '适航', '适航证', '型号合格证', 'TC证', '空管', '空域改革',
  '飞行营地', '低空旅游', '航空应急', '无人机配送', '无人机物流', '城市空中交通', 'UAM',
  // —— 海外低空/eVTOL ——
  'Joby', 'Archer', 'Lilium', 'Volocopter', 'Wisk', 'Vertical Aerospace', 'Beta Technologies',
  'Eve Air', 'Supernal', 'eVTOL', 'air taxi', 'urban air mobility', 'advanced air mobility', 'eVTOL', 'drone delivery'
];

const AEROSPACE = [
  '商业航天', '商业火箭', '运载火箭', '火箭发射', '发射场', '入轨', '首飞',
  '可回收火箭', '回收复用', '垂直回收', '海上回收',
  '卫星', '星座', '卫星互联网', '星网', '千帆', 'G60', '低轨卫星', '遥感卫星', '通信卫星',
  '蓝箭', '朱雀', '星河动力', '谷神星', '智神星', '天兵科技', '天龙', '中科宇航', '力箭',
  '星际荣耀', '双曲线', '东方空间', '引力一号', '深蓝航天', '星云', '捷龙', '快舟', '长征',
  '航天科技集团', '航天科工', '国家航天局', '探月', '空间站', '神舟', '天舟', '嫦娥', '北斗',
  '酒泉', '文昌', '太原', '西昌', '海南商发', '航天驭星', '微纳星空', '银河航天', '时空道宇',
  // —— 海外商业航天 ——
  'SpaceX', '星链', 'Starlink', 'Falcon', 'Starship', 'Blue Origin', 'New Glenn', 'New Shepard',
  'Rocket Lab', 'Electron', 'Neutron', 'OneWeb', 'Kuiper', 'ULA', 'Vulcan', 'Ariane', 'Arianespace',
  'NASA', 'ESA', 'Sierra Space', 'Firefly', 'Relativity', 'Astra', 'satellite', 'launch', 'orbit'
];

const NOISE = [
  '股吧', '涨停', '快讯：', '盘中异动', '概念股拉升', '游资', '主力资金', '龙虎榜',
  // 综合财经汇总/打包内容：主旨非本领域，仅顺带提及，过滤掉避免污染精选
  '四大证券报', '证券报精华', '财经晚报', '财经早报', '头版头条', '重要财经媒体',
  '新闻联播', '早参', '晚参', '盘前必读', '盘后', '复盘', '收评', '午评', '早评',
  '重磅消息一览', '重要事件', '今日要闻', '每经', '一周要闻'
];

function matchDomain(text) {
  const t = text || '';
  const la = LOWALTITUDE.some(k => t.includes(k));
  const ae = AEROSPACE.some(k => t.includes(k));
  if (la && ae) return 'both';
  if (la) return 'lowaltitude';
  if (ae) return 'aerospace';
  return null;
}

function keywordHits(text) {
  const t = text || '';
  let n = 0;
  for (const k of [...LOWALTITUDE, ...AEROSPACE]) if (t.includes(k)) n++;
  return n;
}

function isNoise(text) {
  return NOISE.some(k => (text || '').includes(k));
}

module.exports = { LOWALTITUDE, AEROSPACE, matchDomain, keywordHits, isNoise };
