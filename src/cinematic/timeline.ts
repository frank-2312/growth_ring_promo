import { sec } from '../theme';

/**
 * 电影版时间轴：37 秒，五个连续镜头。
 * 场景之间不是硬切，而是镜头运动/前景遮挡衔接——看起来像"一镜到底"。
 */
export const cinematicScenes = [
  { id: 'dive', start: 0, duration: sec(7) },   // 镜头穿过年轮深潜
  { id: 'fly', start: sec(7), duration: sec(8) },  // 文字从深处飞向镜头
  { id: 'space', start: sec(15), duration: sec(9) }, // 悬浮卡片 + 镜头横移
  { id: 'book', start: sec(24), duration: sec(8) },  // 书页翻过镜头
  { id: 'outro', start: sec(32), duration: sec(5) }, // 拉远收尾
] as const;

/** 按场景 id 取时长，场景组件内部用。 */
export const sceneFrames = {
  dive: cinematicScenes[0].duration,
  fly: cinematicScenes[1].duration,
  space: cinematicScenes[2].duration,
  book: cinematicScenes[3].duration,
  outro: cinematicScenes[4].duration,
} as const;

export const cinematicTotalFrames = sec(37);
