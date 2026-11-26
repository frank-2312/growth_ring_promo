import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { fps, sec } from '../theme';
import { sceneDurationSec } from '../timeline';
import { useConfig } from '../config';
import { fadeIn, popIn, riseIn, sceneOpacity } from '../anim';
import { Grain } from '../components/Grain';

const DURATION = sec(sceneDurationSec.reveal);

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { content, colors: theme } = useConfig();
  const c = content.reveal;
  const opacity = sceneOpacity(frame, 0, DURATION, sec(0.5));

  return (
    <AbsoluteFill style={{ background: theme.nightBg, fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.05} />

      {/* 两行叙事 */}
      <div style={{ position: 'absolute', top: 300, left: 90, right: 90 }}>
        <div
          style={{
            color: theme.nightInk,
            fontSize: 62,
            lineHeight: 1.5,
            letterSpacing: 2,
            ...riseIn(frame, sec(0.15), 30),
          }}
        >
          {c.line1}
        </div>
        <div
          style={{
            marginTop: 16,
            color: theme.nightMoss,
            fontSize: 50,
            lineHeight: 1.5,
            letterSpacing: 2,
            ...riseIn(frame, sec(0.9), 30),
          }}
        >
          {c.line2}
        </div>
      </div>

      {/* 原文证据卡片：逐条滑入 */}
      <div style={{ position: 'absolute', top: 760, left: 72, right: 72 }}>
        <div
          style={{
            color: theme.nightAmber,
            fontSize: 34,
            letterSpacing: 5,
            marginBottom: 28,
            opacity: fadeIn(frame, sec(1.7), sec(0.4)),
          }}
        >
          {c.evidenceTitle}
        </div>
        {c.evidence.map((line, i) => {
          const start = sec(2 + i * 1.15);
          const p = popIn(frame, fps, start, { damping: 28 });
          return (
            <div
              key={i}
              style={{
                background: theme.nightSurface,
                border: `1px solid ${theme.nightLine}`,
                borderLeft: `4px solid ${theme.nightAmber}`,
                borderRadius: 14,
                padding: '28px 30px',
                marginBottom: 18,
                color: theme.nightInk,
                fontSize: 38,
                lineHeight: 1.5,
                opacity: fadeIn(frame, start, sec(0.3)),
                transform: `translateX(${(1 - p) * 50}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* 收尾点题 */}
      <div
        style={{
          position: 'absolute',
          bottom: 130,
          left: 90,
          right: 90,
          textAlign: 'center',
          color: theme.nightInkSoft,
          fontSize: 32,
          lineHeight: 1.5,
          letterSpacing: 1,
          opacity: fadeIn(frame, sec(5), sec(0.5)),
        }}
      >
        {c.kicker}
      </div>
    </AbsoluteFill>
  );
};
