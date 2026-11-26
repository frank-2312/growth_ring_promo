import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { sec } from '../theme';
import { sceneDurationSec } from '../timeline';
import { useConfig } from '../config';
import { fadeIn, sceneOpacity } from '../anim';
import { TypeLine } from '../components/TypeLine';
import { Grain } from '../components/Grain';

const DURATION = sec(sceneDurationSec.hook);

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { content, colors: theme, brand } = useConfig();
  const c = content.hook;
  const opacity = sceneOpacity(frame, 0, DURATION, sec(0.5));

  // 第一句"它说我怕被落下"逐字打出（0.4s 起）
  // 第二句"我删了"在停顿后砸出（3.2s 起），字更大、琥珀色
  const line2Scale = interpolate(frame, [sec(3.2), sec(3.6), sec(4.2)], [0.92, 1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const line2Opacity = fadeIn(frame, sec(3.2), sec(0.3));

  return (
    <AbsoluteFill style={{ background: theme.nightBg, fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.05} />

      {/* 第一句：像别人给你的评价，冷静地逐字浮现 */}
      <div
        style={{
          position: 'absolute',
          top: 620,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: theme.nightInk,
          fontSize: 66,
          letterSpacing: 3,
          lineHeight: 1.6,
          opacity: fadeIn(frame, sec(0.2), sec(0.2)),
        }}
      >
        <TypeLine text={c.line1} start={0.4} charSeconds={0.13} cursor={false} />
      </div>

      {/* 第二句：你的反击，"删了"——更大的字、琥珀色、带一记缩放冲击 */}
      <div
        style={{
          position: 'absolute',
          top: 860,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: theme.nightAmber,
          fontSize: 96,
          fontWeight: 600,
          letterSpacing: 4,
          opacity: line2Opacity,
          transform: `scale(${line2Scale})`,
        }}
      >
        <TypeLine text={c.line2} start={3.2} charSeconds={0.16} cursor={false} />
      </div>

      {/* 一条划掉第一句的删除线，在"删了"出现时划过 */}
      <div
        style={{
          position: 'absolute',
          top: 692,
          left: '50%',
          height: 3,
          background: theme.nightAmber,
          width: interpolate(frame, [sec(3.6), sec(4.3)], [0, 620], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: 'translateX(-50%) rotate(-1deg)',
          opacity: fadeIn(frame, sec(3.6), sec(0.15)) * fadeOutAfter(frame),
        }}
      />

      {/* 底部署名，最后淡淡出现 */}
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          width: '100%',
          textAlign: 'center',
          color: theme.nightInkSoft,
          fontSize: 30,
          letterSpacing: 4,
          opacity: fadeIn(frame, sec(4.6), sec(0.6)),
        }}
      >
        {brand.packageName}
      </div>
    </AbsoluteFill>
  );
};

// 删除线划过后不一直接着，停留 1 秒后淡出，避免抢戏
function fadeOutAfter(frame: number) {
  return interpolate(frame, [sec(5.2), sec(5.8)], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}
