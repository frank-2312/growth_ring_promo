import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { sec } from '../theme';
import { sceneDurationSec } from '../timeline';
import { useConfig } from '../config';
import { fadeIn, riseIn, sceneOpacity } from '../anim';
import { RingMark } from '../components/RingMark';
import { Grain } from '../components/Grain';

const DURATION = sec(sceneDurationSec.outro);

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { content, colors: theme, brand } = useConfig();
  const c = content.outro;
  const opacity = sceneOpacity(frame, 0, DURATION, sec(0.87));
  const ringScale = interpolate(frame, [0, sec(6.67)], [0.7, 1.15], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: theme.nightBg, fontFamily: FONT_FAMILY, opacity }}>
      {/* 年轮从中心缓缓放大 */}
      <div
        style={{
          position: 'absolute',
          top: 520,
          left: '50%',
          marginLeft: -380,
          transform: `scale(${ringScale})`,
          opacity: 0.6,
        }}
      >
        <RingMark size={760} color={theme.nightAmber} breathe={0} rotate={-14} />
      </div>
      <Grain opacity={0.05} />

      {/* 隐私主张 */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {c.privacyLines.map((line, i) => (
          <div
            key={i}
            style={{
              color: i === 0 ? theme.nightInkSoft : theme.nightMoss,
              fontSize: i === 0 ? 40 : 44,
              lineHeight: 1.7,
              ...riseIn(frame, sec(0.33) + i * sec(0.53), 30),
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* CTA：App 名 */}
      <div
        style={{
          position: 'absolute',
          top: 1120,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: theme.nightInk,
            fontSize: 150,
            fontWeight: 600,
            letterSpacing: 20,
            opacity: fadeIn(frame, sec(3), sec(1)),
            transform: `scale(${0.9 + fadeIn(frame, sec(3), sec(1)) * 0.1})`,
          }}
        >
          {brand.name}
        </div>
        <div
          style={{
            marginTop: 24,
            color: theme.nightAmber,
            fontSize: 34,
            letterSpacing: 4,
            opacity: fadeIn(frame, sec(4.33), sec(1)),
          }}
        >
          {brand.slogan}
        </div>
      </div>

      {/* 结尾渐隐到黑 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          opacity: interpolate(frame, [sec(7.83), DURATION], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
