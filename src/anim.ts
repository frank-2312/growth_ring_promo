import { interpolate, spring, SpringConfig } from 'remotion';

// 缓动曲线：一个偏"稳"的 ease-out，动画收尾干净不弹跳
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// 淡入：从 frame 开始，持续 duration 帧
export const fadeIn = (frame: number, start: number, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });

// 淡出：在 end 之前的 duration 帧内渐隐
export const fadeOut = (frame: number, end: number, duration = 20) =>
  interpolate(frame, [end - duration, end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// 出场窗口：进场淡入 + 出场淡出，用于单个 Scene
export const sceneOpacity = (
  frame: number,
  start: number,
  end: number,
  fade = 18,
) => fadeIn(frame, start, fade) * fadeOut(frame, end, fade);

// 上移淡入：常用于标题逐行出现
export const riseIn = (
  frame: number,
  start: number,
  distance = 40,
  duration = 24,
) => {
  const p = fadeIn(frame, start, duration);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

// 弹性出现：用于 Jahr/ emphasis 元素，带一点自然的回弹
export const popIn = (
  frame: number,
  fps: number,
  start: number,
  config?: Partial<SpringConfig>,
) =>
  spring({
    frame: frame - start,
    fps,
    config: { damping: 200, stiffness: 120, mass: 0.9, ...config },
  });
