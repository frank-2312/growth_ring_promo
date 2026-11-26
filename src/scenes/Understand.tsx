import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { fps, sec, theme as defaultTheme } from '../theme';
import { sceneDurationSec } from '../timeline';
import { useConfig } from '../config';
import { fadeIn, popIn, riseIn, sceneOpacity } from '../anim';
import { Grain } from '../components/Grain';

const DURATION = sec(sceneDurationSec.understand);
const FIELD_STEP = sec(1.53); // 每个字段间隔（秒）

export const Understand: React.FC = () => {
  const frame = useCurrentFrame();
  const { content, colors: theme } = useConfig();
  const c = content.understand;
  const opacity = sceneOpacity(frame, 0, DURATION, sec(0.8));

  return (
    <AbsoluteFill style={{ background: theme.nightBg, fontFamily: FONT_FAMILY, opacity }}>
      {/* 右侧一个半透明年轮作为氛围 */}
      <div style={{ position: 'absolute', top: 1180, right: -180, opacity: 0.28 }}>
        <div style={{ transform: 'scale(0.8)' }}>
          <RingSoft />
        </div>
      </div>
      <Grain opacity={0.05} />

      {/* 顶部标签与两行标题 */}
      <div style={{ position: 'absolute', top: 170, left: 96, right: 96 }}>
        <div
          style={{
            color: theme.nightAmber,
            fontSize: 30,
            letterSpacing: 4,
            ...riseIn(frame, sec(0.07), 20),
          }}
        >
          {c.label}
        </div>
        <div
          style={{
            marginTop: 22,
            color: theme.nightInk,
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.45,
            letterSpacing: 1,
            ...riseIn(frame, sec(0.47), 40),
          }}
        >
          {c.heading}
          <br />
          <span style={{ color: theme.nightAmber }}>{c.heading2}</span>
        </div>
      </div>

      {/* 画像字段卡片，逐个浮现 */}
      <div style={{ position: 'absolute', top: 620, left: 72, right: 72 }}>
        {c.personaFields.map((field, i) => {
          const start = sec(2.33) + i * FIELD_STEP;
          const p = popIn(frame, fps, start, { damping: 30 });
          const appear = fadeIn(frame, start, sec(0.47));
          return (
            <div
              key={field.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 28,
                background: theme.nightSurface,
                border: `1px solid ${theme.nightLine}`,
                borderLeft: `4px solid ${theme.nightAmber}`,
                borderRadius: 16,
                padding: '30px 34px',
                marginBottom: 20,
                opacity: appear,
                transform: `translateX(${(1 - p) * 40}px)`,
              }}
            >
              <div style={{ minWidth: 230 }}>
                <div style={{ color: theme.nightMoss, fontSize: 28, letterSpacing: 2 }}>
                  {field.key}
                </div>
              </div>
              <div style={{ color: theme.nightInk, fontSize: 32, lineHeight: 1.5, flex: 1 }}>
                {field.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部证据说明：反讨好的硬约束 */}
      <div
        style={{
          position: 'absolute',
          bottom: 130,
          left: 96,
          right: 96,
          textAlign: 'center',
          color: theme.nightInkSoft,
          fontSize: 27,
          letterSpacing: 1,
          opacity: fadeIn(frame, sec(8.33), sec(1)),
        }}
      >
        {c.evidence}
      </div>
    </AbsoluteFill>
  );
};

// 一个小号的静态年轮，避免重复引入 useCurrentFrame 造成动画叠加
const RingSoft: React.FC = () => {
  const frame = useCurrentFrame();
  const { colors: theme } = useConfig();
  const rings = Array.from({ length: 14 }, (_, i) => {
    const t = i / 13;
    const r = 30 + t * 230;
    return { r, opacity: 0.2 + t * 0.5 };
  });
  return (
    <svg viewBox="0 0 600 600" width={600} height={600} style={{ transform: `rotate(${frame * 0.04}deg)` }}>
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx="300"
          cy="300"
          r={ring.r}
          fill="none"
          stroke={theme.nightAmber}
          strokeWidth="2"
          strokeOpacity={ring.opacity}
        />
      ))}
    </svg>
  );
};
