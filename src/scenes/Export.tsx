import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { fps, sec } from '../theme';
import { sceneDurationSec } from '../timeline';
import { useConfig } from '../config';
import { fadeIn, popIn, riseIn, sceneOpacity } from '../anim';
import { Grain } from '../components/Grain';

const DURATION = sec(sceneDurationSec.export);
const BOOK_W = 620;
const BOOK_H = 860;

export const Export: React.FC = () => {
  const frame = useCurrentFrame();
  const { content, colors: theme } = useConfig();
  const c = content.exportScene;
  const opacity = sceneOpacity(frame, 0, DURATION, sec(0.8));

  // 封面绕左边缘翻开（rotateY 到 -160°），露出内页文字；
  // backfaceVisibility:hidden 让封面翻过 90° 后自动隐藏。
  const coverRotate = interpolate(frame, [sec(1.67), sec(3.93)], [0, -160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bookPop = popIn(frame, fps, sec(1.33), { damping: 26 });

  return (
    <AbsoluteFill style={{ background: theme.paperSurfaceHi, fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.07} />

      {/* 顶部标签与标题 */}
      <div style={{ position: 'absolute', top: 180, left: 96, right: 96, textAlign: 'center' }}>
        <div
          style={{
            color: theme.paperAmber,
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
            color: theme.paperInk,
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.45,
            ...riseIn(frame, sec(0.47), 40),
          }}
        >
          {c.heading}
        </div>
      </div>

      {/* 书本：封面沿左边缘翻开 */}
      <div
        style={{
          position: 'absolute',
          top: 620,
          left: '50%',
          marginLeft: -BOOK_W / 2,
          perspective: 1600,
          transform: `scale(${0.92 + bookPop * 0.08})`,
          opacity: fadeIn(frame, sec(1.33), sec(0.53)),
        }}
      >
        <div
          style={{
            position: 'relative',
            width: BOOK_W,
            height: BOOK_H,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 书页底（翻开后露出的内页） */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: theme.paperBg,
              border: `1px solid ${theme.paperLine}`,
              borderRadius: 6,
              boxShadow: '0 30px 90px rgba(42,38,34,0.18)',
              padding: '90px 70px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ color: theme.paperInkSoft, fontSize: 28, letterSpacing: 3, textAlign: 'center' }}>
              这一刻的你
            </div>
            <div style={{ height: 2, background: theme.paperLine, margin: '40px 0' }} />
            {['安静，但心里有很多在转。', '想独立，也怕被落下。', '写了很多次，却没说破的事。'].map(
              (line, i) => (
                <div
                  key={i}
                  style={{
                    color: theme.paperInk,
                    fontSize: 32,
                    lineHeight: 2,
                    opacity: fadeIn(frame, sec(4) + i * sec(0.67), sec(0.53)),
                  }}
                >
                  {line}
                </div>
              ),
            )}
          </div>

          {/* 封面，绕左边缘翻开 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: theme.nightBg,
              borderRadius: 6,
              transformOrigin: 'left center',
              transform: `rotateY(${coverRotate}deg)`,
              backfaceVisibility: 'hidden',
              boxShadow: '12px 0 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ opacity: 0.75 }}>
              <RingGlyph />
            </div>
            <div style={{ color: theme.nightInk, fontSize: 56, letterSpacing: 6, marginTop: 40 }}>
              {c.bookTitle}
            </div>
            <div style={{ color: theme.nightAmber, fontSize: 28, letterSpacing: 4, marginTop: 20 }}>
              {c.bookSub}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RingGlyph: React.FC = () => {
  const { colors: theme } = useConfig();
  return (
    <svg viewBox="0 0 300 300" width={240} height={240}>
      {Array.from({ length: 10 }, (_, i) => {
        const r = 24 + (i / 9) * 120;
        return (
          <circle
            key={i}
            cx="150"
            cy="150"
            r={r}
            fill="none"
            stroke={theme.nightAmber}
            strokeWidth="2"
            strokeOpacity={0.3 + (i / 9) * 0.6}
          />
        );
      })}
    </svg>
  );
};
