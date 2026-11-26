import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { fps, sec } from '../theme';
import { sceneDurationSec } from '../timeline';
import { useConfig } from '../config';
import { fadeIn, popIn, riseIn, sceneOpacity } from '../anim';
import { Grain } from '../components/Grain';

const DURATION = sec(sceneDurationSec.write);
const CHARS_PER_SEC = 0.55 * 30; // 保持原打字手感：每秒约 16.5 字，与帧率无关

export const Write: React.FC = () => {
  const frame = useCurrentFrame();
  const { content, colors: theme } = useConfig();
  const c = content.write;
  const opacity = sceneOpacity(frame, 0, DURATION, sec(0.8));

  // 打字机效果：按秒推进的可见字数，改帧率不影响打字速度
  const SAMPLE_LINES = c.sampleText.split('\n');
  const totalChars = SAMPLE_LINES.join('').length;
  const visibleChars = Math.floor(
    interpolate(
      frame,
      [sec(1.33), sec(1.33) + totalChars / CHARS_PER_SEC],
      [0, totalChars],
      { extrapolateRight: 'clamp' },
    ),
  );

  let consumed = 0;
  const typedLines = SAMPLE_LINES.map((line, i) => {
    const start = consumed;
    consumed += line.length;
    const n = Math.max(0, Math.min(line.length, visibleChars - start));
    return { text: line.slice(0, n), done: n === line.length, key: i };
  });

  const saveBadge = popIn(frame, fps, sec(5.83));

  return (
    <AbsoluteFill style={{ background: theme.paperBg, fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.06} />

      {/* 顶部标签与标题 */}
      <div style={{ position: 'absolute', top: 200, left: 96, right: 96 }}>
        <div
          style={{
            color: theme.paperAmber,
            fontSize: 30,
            letterSpacing: 4,
            ...riseIn(frame, sec(0.13), 20),
          }}
        >
          {c.label}
        </div>
        <div
          style={{
            marginTop: 24,
            color: theme.paperInk,
            fontSize: 62,
            fontWeight: 600,
            letterSpacing: 2,
            ...riseIn(frame, sec(0.6), 40),
          }}
        >
          {c.heading}
        </div>
      </div>

      {/* 日记纸面：一张微微浮起的卡片 */}
      <div
        style={{
          position: 'absolute',
          top: 540,
          left: 72,
          right: 72,
          minHeight: 780,
          background: theme.paperSurface,
          border: `1px solid ${theme.paperLine}`,
          borderRadius: 24,
          boxShadow: '0 24px 80px rgba(42, 38, 34, 0.10)',
          padding: '70px 64px',
          boxSizing: 'border-box',
          ...riseIn(frame, sec(1), 60),
        }}
      >
        <div style={{ color: theme.paperInkSoft, fontSize: 30, letterSpacing: 2 }}>
          {c.sampleDate}
        </div>
        <div style={{ height: 1, background: theme.paperLine, margin: '32px 0 48px' }} />

        <div style={{ color: theme.paperInk, fontSize: 44, lineHeight: 1.9, letterSpacing: 1 }}>
          {typedLines.map((l) => (
            <div key={l.key} style={{ minHeight: 84 }}>
              {l.text}
              {!l.done && l.text.length > 0 && (
                <span style={{ opacity: frame % sec(1) < sec(0.5) ? 1 : 0 }}>|</span>
              )}
            </div>
          ))}
        </div>

        {/* 自动保存提示 */}
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            right: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: theme.paperMoss,
            fontSize: 26,
            opacity: saveBadge * fadeIn(frame, sec(5.83), sec(0.4)),
            transform: `translateY(${(1 - saveBadge) * 16}px)`,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: theme.paperMoss,
            }}
          />
          {c.autoSave}
        </div>
      </div>
    </AbsoluteFill>
  );
};
