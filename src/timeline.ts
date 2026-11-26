import { sec } from './theme';

/**
 * 场景时间轴：全部用「秒」定义，帧数由 sec() 统一换算。
 * 想调节奏，只改这里的数字即可 —— 场景顺序、时长、总时长都会跟着变。
 */
export const timeline = [
  { id: 'hook', start: 0, duration: 6 }, // 钩子：它说我怕被落下 / 我删了
  { id: 'reveal', start: 6, duration: 7 }, // 反转：它附上原文证据回来了
  { id: 'reveal2', start: 13, duration: 6 }, // 揭晓：会反驳你的日记本
  { id: 'write', start: 19, duration: 6 }, // 写
  { id: 'understand', start: 25, duration: 9 }, // 懂
  { id: 'export', start: 34, duration: 7 }, // 导出
  { id: 'outro', start: 41, duration: 7 }, // 隐私 + CTA
] as const;

export type SceneId = (typeof timeline)[number]['id'];

// 预计算成帧，供 Sequence 使用
export const sceneFrames = timeline.map((s) => ({
  ...s,
  fromFrame: sec(s.start),
  durationFrames: sec(s.duration),
}));

// 各场景拿到的是「自己的相对帧」，所以场景内部动画仍用相对秒数即可。
export const sceneDurationSec = Object.fromEntries(
  timeline.map((s) => [s.id, s.duration]),
) as Record<SceneId, number>;
