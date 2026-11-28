// ============================================================
// 第二款视频（GrowthRingKinetic）文案。
// 30 秒 · Glitch 科技感 × 纸墨温度 · 强冲击快节奏。
// 改文字只动这个文件。第一款（冲突钩子版）文案在 src/content.ts。
// ============================================================

export const kineticContent = {
  // 场景 1 · Glitch 钩子（0-5s）
  glitch: {
    kicker: '你以为日记只是记录',
    main: '它在偷偷给你画像。',
    sub: '年轮 · growth_ring',
  },

  // 场景 2 · Decode 解码（5-10s）
  decode: {
    line1: '它读你写下的每一篇，',
    line2: '形成一个可以被推翻的假设。',
  },

  // 场景 3 · 数字滚动（10-15s）
  numbers: {
    heading: '过去这段时间，',
    items: [
      { value: 183, suffix: '篇', label: '日记被它读过' },
      { value: 47, suffix: '次', label: '旧结论被你自己推翻' },
      { value: 1, suffix: '个', label: '越来越像你的假设' },
    ],
  },

  // 场景 4 · 荧光笔标注（15-21s）
  highlight: {
    line: '它圈出了你没说破的那句话',
    marked: '「说不在乎是假的」',
    note: '并附上你写它的那一天。',
    evidence: '6月8日 · 周五',
  },

  // 场景 5 · 幕布转场（21-26s）
  curtain: {
    before: '不是算命。',
    after: '是年轮。',
    slogan: '一本会越来越懂你的日记本',
  },

  // 场景 6 · 清晰收尾（26-30s）
  clarity: {
    lines: ['没有账号，没有云同步。', '日记只存在你的设备上。'],
    cta: '年轮',
    sub: '从今天开始，写给自己看。',
  },
} as const;
