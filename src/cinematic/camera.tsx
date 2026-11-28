import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { theme } from '../theme';

/**
 * 电影镜头系统。
 *
 * 与之前所有场景的本质区别：画面是一个 3D 空间，有一台虚拟摄像机在运动，
 * 元素分布在不同深度（translateZ），近大远小、视差、前景遮挡全部由
 * CSS perspective 自然产生。这不是"一屏幻灯片 + 淡入"，而是"一个连续镜头"。
 *
 * 所有运动基于 frame 确定性计算，无 Math.random，本地与 Colab 逐帧一致。
 */

export type CameraState = {
  scale: number;
  x: number;
  y: number;
  roll: number;
};

type CamKey = {
  f: number; // 帧
  scale: number;
  x?: number;
  y?: number;
  roll?: number; // 度
};

/** 用几个关键帧定义一条镜头路径，平滑插值（smoothstep）。 */
export const camPath = (frame: number, keys: CamKey[]): CameraState => {
  let i = 0;
  while (i < keys.length - 1 && frame >= keys[i + 1].f) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const t0 = b.f === a.f ? 0 : Math.max(0, Math.min(1, (frame - a.f) / (b.f - a.f)));
  const e = t0 * t0 * (3 - 2 * t0); // smoothstep
  return {
    scale: a.scale + (b.scale - a.scale) * e,
    x: (a.x ?? 0) + ((b.x ?? 0) - (a.x ?? 0)) * e,
    y: (a.y ?? 0) + ((b.y ?? 0) - (a.y ?? 0)) * e,
    roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * e,
  };
};

/** 全局摄像机容器：perspective 让子层的 translateZ 产生真实景深。 */
export const CinematicCamera: React.FC<{
  state: CameraState;
  background?: string;
  children: React.ReactNode;
}> = ({ state, background = theme.nightBg, children }) => (
  <AbsoluteFill style={{ backgroundColor: background, overflow: 'hidden', perspective: 1000 }}>
    <AbsoluteFill
      style={{
        transform: `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale}) rotate(${state.roll}deg)`,
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 50%',
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

/** 深度层：z 为负是远景（小、慢），为正是近景（大、快）。 */
export const Depth: React.FC<{
  z: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ z, children, style }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `translateZ(${z}px)`,
      transformStyle: 'preserve-3d',
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * 年轮：多层同心圆分布在不同深度，镜头推进时层层掠过，形成"深潜"视差。
 */
export const Rings: React.FC<{
  frame: number;
  color?: string;
  count?: number;
  spin?: number; // 每帧旋转度
  base?: number; // 最内圈半径
  gap?: number; // 每层半径增量
  zStep?: number; // 每层 Z 增量
  opacity?: number;
}> = ({
  frame,
  color = theme.nightAmber,
  count = 14,
  spin = 0.05,
  base = 60,
  gap = 46,
  zStep = 26,
  opacity = 1,
}) => (
  <div style={{ position: 'relative', width: 1, height: 1, transformStyle: 'preserve-3d' }}>
    {Array.from({ length: count }, (_, i) => {
      const r = base + i * gap;
      const z = -count * zStep + i * zStep; // 内层远、外层近
      const rot = frame * spin * (i % 2 === 0 ? 1 : -1);
      const a = opacity * (0.18 + (i / count) * 0.62);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            transform: `translateZ(${z}px) rotate(${rot}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg width={r * 2} height={r * 2} style={{ position: 'absolute', left: -r, top: -r, overflow: 'visible' }}>
            <circle
              cx={r}
              cy={r}
              r={r - 6}
              fill="none"
              stroke={color}
              strokeWidth={i % 3 === 0 ? 3 : 1.5}
              strokeOpacity={a}
              strokeDasharray={i % 4 === 0 ? `${r * 0.8} ${r * 0.12}` : undefined}
            />
          </svg>
        </div>
      );
    })}
  </div>
);

/**
 * 飞行文字：从远处（负 Z）冲向镜头（正 Z），近大远小、擦过画面。
 * spring 用 overshoot 制造惯性，这是"电影文字"区别于"PPT淡入"的关键。
 */
export const FlyText: React.FC<{
  text: string;
  frame: number;
  start: number;
  duration: number;
  fromZ?: number;
  toZ?: number;
  x?: number;
  y?: number;
  color: string;
  fontSize: number;
  rotate?: number;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  fadeOut?: number; // 场景内帧：从这里开始淡出；不传则一直保持可见
  fadeOutDur?: number;
}> = ({
  text,
  frame,
  start,
  duration,
  fromZ = -600,
  toZ = 180,
  x = 0,
  y = 0,
  color,
  fontSize,
  rotate = 0,
  weight = 700,
  align = 'center',
  fadeOut,
  fadeOutDur = 20,
}) => {
  const t = Math.max(0, Math.min(1, (frame - start) / duration));
  // ease-out：冲得快、停得稳，带轻微回弹
  const e = 1 - Math.pow(1 - t, 3);
  const overshoot = Math.sin(t * Math.PI) * 1.06;
  const z = fromZ + (toZ - fromZ) * e;
  const scale = 0.55 + 0.45 * e * overshoot;
  // 可见度与飞行解耦：飞入时淡入，飞到位置后保持，只在 fadeOut 时淡出
  const fadeIn = Math.min(1, Math.max(0, (frame - start) / (duration * 0.25)));
  const fadeOutP = fadeOut === undefined ? 1 : Math.max(0, Math.min(1, (fadeOut + fadeOutDur - frame) / fadeOutDur));
  const opacity = fadeIn * fadeOutP;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotate(${rotate * (1 - e)}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        whiteSpace: 'nowrap',
        opacity,
        color,
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: weight,
        letterSpacing: 2,
        textAlign: align,
        textShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      {text}
    </div>
  );
};

/** 前景掠过：一个巨大的模糊元素从镜头前划过，制造"有东西挡在镜头前"的真实感。 */
export const ForegroundSweep: React.FC<{
  frame: number;
  start: number;
  duration: number;
  color?: string;
  fromX?: number;
  toX?: number;
  size?: number;
  blur?: number;
}> = ({
  frame,
  start,
  duration,
  color = theme.nightSurface,
  fromX = -1200,
  toX = 1200,
  size = 900,
  blur = 60,
}) => {
  const t = Math.max(0, Math.min(1, (frame - start) / duration));
  const e = t * t * (3 - 2 * t);
  const x = fromX + (toX - fromX) * e;
  const opacity = Math.sin(t * Math.PI) * 0.95;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate3d(${x}px, 0, 620px)`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color} 55%, transparent 72%)`,
        filter: `blur(${blur}px)`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

/** 镜头光斑：缓慢漂移的暖色光晕，screen 混合，让暗场有"胶片感"。 */
export const LightLeak: React.FC<{
  frame: number;
  color?: string;
  intensity?: number;
  x?: number;
  y?: number;
  speed?: number;
}> = ({ frame, color = theme.nightAmber, intensity = 0.14, x = 0, y = 0, speed = 0.6 }) => {
  const dx = Math.sin(frame / 90 * speed) * 260 + x;
  const dy = Math.cos(frame / 110 * speed) * 180 + y;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
        width: 1100,
        height: 1100,
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 62%)`,
        mixBlendMode: 'screen',
        opacity: intensity,
        pointerEvents: 'none',
      }}
    />
  );
};

/** 噪点纹理：极淡的颗粒，避免纯色背景的"数字平板感"。 */
export const FilmGrain: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.05 }) => {
  // 用确定性的小偏移模拟颗粒抖动，不用随机
  const ox = (frame * 13) % 97;
  const oy = (frame * 29) % 89;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity,
        backgroundImage:
          'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\'/></filter><rect width=\'160\' height=\'160\' filter=\'url(%23n)\' opacity=\'0.5\'/></svg>")',
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

/** 镜头内的静态说明小字（不参与飞行，用于落版）。 */
export const Caption: React.FC<{
  text: string;
  opacity: number;
  color?: string;
  fontSize?: number;
  letterSpacing?: number;
  top?: number | string;
}> = ({ text, opacity, color = theme.nightInkSoft, fontSize = 30, letterSpacing = 4, top }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: top ?? '50%',
      textAlign: 'center',
      color,
      fontFamily: FONT_FAMILY,
      fontSize,
      letterSpacing,
      opacity,
      transform: 'translateY(-50%)',
    }}
  >
    {text}
  </div>
);

export const fadeWindow = (frame: number, start: number, inDur: number, end: number, outDur: number) =>
  Math.min(interpolate(frame, [start, start + inDur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }), interpolate(frame, [end - outDur, end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
