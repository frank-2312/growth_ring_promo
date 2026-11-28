import { sec } from '../theme';

/**
 * 第二款视频时间轴（30 秒 / 6 场景）。
 * 全部用秒定义，sec() 统一换算成帧。调节奏只改这里。
 */
export const kineticTimeline = [
  { id: 'glitch', start: 0, duration: 5 },
  { id: 'decode', start: 5, duration: 5 },
  { id: 'numbers', start: 10, duration: 5 },
  { id: 'highlight', start: 15, duration: 6 },
  { id: 'curtain', start: 21, duration: 5 },
  { id: 'clarity', start: 26, duration: 4 },
] as const;

export const kineticFrames = kineticTimeline.map((s) => ({
  ...s,
  fromFrame: sec(s.start),
  durationFrames: sec(s.duration),
}));

export const kineticDurationSec = Object.fromEntries(
  kineticTimeline.map((s) => [s.id, s.duration]),
) as Record<(typeof kineticTimeline)[number]['id'], number>;

export const kineticTotalFrames = sec(30);
