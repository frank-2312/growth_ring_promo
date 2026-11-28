import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { sec } from '../theme';

// ============================================================
// 2026 流行动效原语：Glitch 色差撕裂 / Decode 解码 / 数字滚动 /
// 手绘荧光笔 / squash&stretch 弹跳。
// 全部基于 frame 做确定性计算，不用 Math.random，
// 保证本地预览与 Colab 渲染出的每一帧完全一致。
// ============================================================

/** 确定性伪随机：同一个 seed 永远得到同一个 [0,1) 值 */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// ---------- 1. Glitch 色差撕裂文字 ----------
export const GlitchText: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  intensity?: number;
  style?: React.CSSProperties;
}> = ({ text, color = '#EDE6DA', fontSize = 92, intensity = 1, style }) => {
  const frame = useCurrentFrame();
  // 每 7 帧爆发一次，持续 2 帧；爆发时错位放大，间隙时几乎归位
  const burst = frame % 7 < 2 ? 1 : 0.1;
  const j = (n: number) => (rand(frame * 3 + n) - 0.5) * 16 * intensity * burst;
  const slices = ['0% 0% 66% 0%', '33% 0% 33% 0%', '66% 0% 0% 0%'];

  return (
    <div style={{ position: 'relative', fontSize, fontFamily: FONT_FAMILY, lineHeight: 1.25, whiteSpace: 'nowrap', ...style }}>
      {/* 红青色差副本：screen 混合制造发光错位。用 transform 而非 left 偏移，避免撑破容器导致换行 */}
      <span style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${j(2)}px)`, color: '#FF3B54', mixBlendMode: 'screen', opacity: 0.8, whiteSpace: 'nowrap' }}>{text}</span>
      <span style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${j(3)}px)`, color: '#22E0FF', mixBlendMode: 'screen', opacity: 0.8, whiteSpace: 'nowrap' }}>{text}</span>
      {/* 主文字 + 水平切片抖动 */}
      <span style={{ position: 'relative', color, opacity: 0.96 }}>{text}</span>
      {slices.map((clip, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `inset(${clip})`,
            transform: `translateX(${j(i + 4)}px)`,
            color,
            opacity: 0.9,
          }}
        >
          {text}
        </span>
      ))}
      {/* 扫描线：短视频里"数字信号"的标志性质感 */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// ---------- 2. Decode 解码成文 ----------
const CHARSET = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ年月日日记年轮画像假设它被推翻';

export const DecodeText: React.FC<{
  text: string;
  start: number; // 秒
  step?: number; // 每个字锁定间隔（秒）
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ text, start, step = 0.11, color = '#EDE6DA', fontSize = 60, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: FONT_FAMILY, fontSize, lineHeight: 1.5, ...style }}>
      {Array.from(text).map((ch, i) => {
        if (ch === ' ' || ch === '\n') return <span key={i}>{ch}</span>;
        const locked = frame >= sec(start) + i * sec(step);
        const shown = locked
          ? ch
          : CHARSET[Math.floor(rand(frame * 0.7 + i * 13) * CHARSET.length)];
        return (
          <span key={i} style={{ color: locked ? color : '#6B7A70' }}>
            {shown}
          </span>
        );
      })}
    </div>
  );
};

// ---------- 3. 数字滚动 ----------
export const CountUp: React.FC<{
  value: number;
  start: number; // 秒
  duration?: number; // 秒
  fontSize?: number;
  color?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ value, start, duration = 1.2, fontSize = 120, color = '#C9A227', suffix = '', style }) => {
  const frame = useCurrentFrame();
  const n = Math.round(
    interpolate(frame, [sec(start), sec(start) + sec(duration)], [0, value], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easeOut,
    }),
  );
  return (
    <span style={{ fontFamily: FONT_FAMILY, fontSize, color, fontWeight: 700, ...style }}>
      {n}
      {suffix}
    </span>
  );
};

// ---------- 4. 手绘荧光笔扫过 ----------
export const MarkerHighlight: React.FC<{
  children: React.ReactNode;
  start: number; // 秒
  duration?: number; // 秒
  color?: string;
}> = ({ children, start, duration = 0.5, color = '#C9A227' }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [sec(start), sec(start) + sec(duration)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          position: 'absolute',
          left: -4,
          right: -4,
          bottom: '0.04em',
          height: '0.46em',
          background: color,
          opacity: 0.5 * p,
          transform: `scaleX(${p}) rotate(-1.2deg)`,
          transformOrigin: 'left center',
          borderRadius: '6px 14px 4px 10px',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};

// ---------- 5. squash & stretch 弹跳入场 ----------
export const KineticWord: React.FC<{
  text: string;
  start: number; // 秒
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ text, start, color = '#EDE6DA', fontSize = 90, style }) => {
  const frame = useCurrentFrame();
  const t = frame - sec(start);
  const p = interpolate(t, [0, sec(0.45)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  // 先横向压扁纵向拉长，再回弹到 1（体积守恒的卡通感）
  const squash =
    t < sec(0.16)
      ? interpolate(t, [0, sec(0.16)], [1.32, 0.86], { extrapolateRight: 'clamp' })
      : interpolate(t, [sec(0.16), sec(0.45)], [0.86, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: easeOut,
        });
  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: 700,
        color,
        opacity: p,
        transform: `scaleX(${squash}) scaleY(${2 - squash}) translateY(${(1 - p) * 40}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ---------- 6. 年轮幕布：一组同心圆从两侧涨大遮屏 ----------
export const RingCurtain: React.FC<{
  progress: number; // 0→1 涨大遮屏，1→0 散开
  color: string;
  side: 'left' | 'right';
}> = ({ progress, color, side }) => {
  const rings = Array.from({ length: 9 }, (_, i) => i);
  const baseX = side === 'left' ? 120 : 960;
  const dir = side === 'left' ? 1 : -1;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {rings.map((i) => {
        const size = (180 + i * 130) * (0.2 + progress * 2.6);
        const x = baseX + dir * (i * 42) * progress;
        const y = 960 + Math.sin(i * 1.7) * 180 * progress;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              border: `${3 + (i % 3)}px solid ${color}`,
              opacity: 0.25 + (i / rings.length) * 0.55,
            }}
          />
        );
      })}
    </div>
  );
};

// ---------- 7. 手绘红圈（SVG 椭圆沿路径描边） ----------
export const HandDrawnCircle: React.FC<{
  start: number; // 秒
  color?: string;
  style?: React.CSSProperties;
}> = ({ start, color = '#FF3B54', style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [sec(start), sec(start) + sec(0.6)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const circumference = 2 * Math.PI * 100;
  return (
    <svg viewBox="0 0 220 90" width="100%" height="100%" style={style}>
      <ellipse
        cx="110"
        cy="45"
        rx="100"
        ry="38"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - p)}
        transform="rotate(-2 110 45)"
        opacity={0.85}
      />
    </svg>
  );
};
