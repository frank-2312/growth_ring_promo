/**
 * 电影运镜版的全部文案。改文字只动这个文件。
 * 注意：文案要短——在运动的镜头里，观众读不了长句。
 */
export const cinematicContent = {
  // 场景1：深潜——镜头穿过层层年轮
  dive: {
    eyebrow: '你的日记里',
    headline: '藏着一个你',
    sub: '只是你还没往下读',
  },
  // 场景2：文字从空间深处飞向镜头
  fly: {
    lines: [
      '你说「随便」的时候',
      '其实写了三遍',
      '最后一遍才是真的',
    ],
    kicker: '它把你删掉的话，都留着',
  },
  // 场景3：画像卡片悬浮在不同深度，镜头穿过
  space: {
    title: '于是它慢慢看清',
    fields: [
      { label: '嘴上说', value: '没事' },
      { label: '本子上', value: '其实很在乎' },
      { label: '结论', value: '想被坚定选择' },
    ],
    note: '每一条，都能翻回原文',
  },
  // 场景4：书页翻过镜头
  book: {
    line1: '把那些没说出口的日子',
    line2: '订成一本只属于你的书',
    footer: '可以打印，可以带走',
  },
  // 场景5：拉远收尾
  outro: {
    privacy1: '所有文字，只在你设备上',
    privacy2: '不上传，不训练，不贩卖',
    brand: '年轮',
    package: 'growth_ring',
    slogan: '一本会越来越懂你的日记本',
    cta: '去写下第一篇',
  },
} as const;
