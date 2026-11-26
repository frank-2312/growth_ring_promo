import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { fps, sec, theme } from '../theme';

type RingMarkProps = {
  size?: number;
  color?: string;
  bg?: string;
  /** 缓慢自转的度数（全程） */
  rotate?: number;
  /** 呼吸缩放的幅度，0 表示不呼吸 */
  breathe?: number;
};

/**
 * 年轮 / 指纹母题：脊线既是树的一圈圈年轮，
 * 也是一个人的指纹 —— 两者的共同点是每一圈都不重复。
 * 用一组略微偏心、略微起伏的同心椭圆来近似。
 */
export const RingMark: React.FC<RingMarkProps> = ({
  size = 620,
  color = theme.nightAmber,
  bg = 'transparent',
  rotate = 18,
  breathe = 0.03,
}) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, sec(15)], [0, rotate], {
    extrapolateRight: 'clamp',
  });
  const scale = 1 + breathe * Math.sin(frame / (fps * 1.4));

  // 生成 16 圈不规则的"年轮"，每圈半径、离心、扁率都略有不同
  const rings = Array.from({ length: 16 }, (_, i) => {
    const t = i / 15;
    const rx = 30 + t * 250;
    const ry = rx * (0.9 + 0.06 * Math.sin(i * 1.7));
    const cx = 300 + 9 * Math.sin(i * 0.9);
    const cy = 300 + 7 * Math.cos(i * 1.3);
    return { rx, ry, cx, cy, opacity: 0.25 + t * 0.6, width: 1 + t * 1.2 };
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        background: bg,
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      <svg viewBox="0 0 600 600" width={size} height={size}>
        <defs>
          <radialGradient id="ring-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.05" />
            <stop offset="70%" stopColor={color} stopOpacity="0.16" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="290" fill="url(#ring-fade)" />
        {rings.map((r, i) => (
          <ellipse
            key={i}
            cx={r.cx}
            cy={r.cy}
            rx={r.rx}
            ry={r.ry}
            fill="none"
            stroke={color}
            strokeWidth={r.width}
            strokeOpacity={r.opacity}
            transform={`rotate(${i * 11 - 20} 300 300)`}
          />
        ))}
        <circle cx="300" cy="300" r="6" fill={color} fillOpacity="0.9" />
      </svg>
    </div>
  );
};
