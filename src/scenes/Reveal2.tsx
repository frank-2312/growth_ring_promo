import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { sec } from '../theme';
import { sceneDurationSec } from '../timeline';
import { useConfig } from '../config';
import { fadeIn, sceneOpacity } from '../anim';
import { RingMark } from '../components/RingMark';
import { Grain } from '../components/Grain';

const DURATION = sec(sceneDurationSec.reveal2);

export const Reveal2: React.FC = () => {
  const frame = useCurrentFrame();
  const { content, colors: theme } = useConfig();
  const c = content.reveal2;
  const opacity = sceneOpacity(frame, 0, DURATION, sec(0.5));

  // 第二句砸出时的缩放冲击
  const punch = interpolate(frame, [sec(1.6), sec(2.0), sec(2.7)], [0.86, 1.05, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // 年轮 Logo 在揭晓后浮现
  const ringOpacity = fadeIn(frame, sec(2.2), sec(0.8));
  const ringScale = interpolate(frame, [sec(2.2), sec(5.5)], [0.8, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: theme.nightBg, fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.05} />

      {/* 年轮 Logo 从下方浮现 */}
      <div
        style={{
          position: 'absolute',
          top: 1180,
          left: '50%',
          marginLeft: -300,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      >
        <RingMark size={600} color={theme.nightAmber} breathe={0} rotate={12} />
      </div>

      {/* 第一句：这不是算命（冷静、小） */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          width: '100%',
          textAlign: 'center',
          color: theme.nightInkSoft,
          fontSize: 54,
          letterSpacing: 6,
          opacity: fadeIn(frame, sec(0.1), sec(0.3)),
        }}
      >
        {c.line1}
      </div>

      {/* 第二句：会反驳你的日记本（巨大、琥珀、砸出） */}
      <div
        style={{
          position: 'absolute',
          top: 680,
          left: 60,
          right: 60,
          textAlign: 'center',
          color: theme.nightAmber,
          fontSize: 84,
          fontWeight: 600,
          lineHeight: 1.4,
          letterSpacing: 2,
          opacity: fadeIn(frame, sec(1.6), sec(0.3)),
          transform: `scale(${punch})`,
        }}
      >
        {c.line2}
      </div>

      {/* 脚注 */}
      <div
        style={{
          position: 'absolute',
          bottom: 130,
          width: '100%',
          textAlign: 'center',
          color: theme.nightMoss,
          fontSize: 30,
          letterSpacing: 2,
          opacity: fadeIn(frame, sec(3.4), sec(0.6)),
        }}
      >
        {c.footnote}
      </div>
    </AbsoluteFill>
  );
};
