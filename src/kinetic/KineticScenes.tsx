import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_FAMILY } from '../fonts';
import { sec, theme } from '../theme';
import { fadeIn, riseIn, sceneOpacity } from '../anim';
import { Grain } from '../components/Grain';
import { RingMark } from '../components/RingMark';
import { kineticContent as C } from './content';
import { kineticDurationSec } from './timeline';
import {
  GlitchText,
  DecodeText,
  CountUp,
  MarkerHighlight,
  KineticWord,
  RingCurtain,
  HandDrawnCircle,
  rand,
} from './effects';

const t = theme;
const dur = (id: keyof typeof kineticDurationSec) => sec(kineticDurationSec[id]);

// ============================================================
// 场景 1 · Glitch 钩子（0-5s）：科技感撕裂 + 反常识钩子
// ============================================================
export const GlitchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 0, dur('glitch'), sec(0.4));

  return (
    <AbsoluteFill style={{ background: '#0B0A09', fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.06} />
      {/* 背景网格：数字信号质感 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(201,162,39,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 360,
          width: '100%',
          textAlign: 'center',
          color: t.nightMoss,
          fontSize: 34,
          letterSpacing: 8,
          ...riseIn(frame, sec(0.2), 24),
        }}
      >
        {C.glitch.kicker}
      </div>
      <div style={{ position: 'absolute', top: 470, width: '100%', textAlign: 'center' }}>
        <GlitchText
          text={C.glitch.main}
          fontSize={78}
          color={t.nightInk}
          intensity={1}
          style={{ display: 'inline-block', textAlign: 'left', fontWeight: 700 }}
        />
      </div>
      {/* 偶发的数据噪点条：进一步强化"信号故障" */}
      {[0, 1, 2].map((i) => {
        const y = 300 + rand(i * 9) * 1200;
        const show = frame % 13 < 2;
        return show ? (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: y,
              left: rand(frame + i) * 300,
              width: 400 + rand(frame * 2 + i) * 500,
              height: 3,
              background: i % 2 ? '#FF3B54' : '#22E0FF',
              opacity: 0.5,
            }}
          />
        ) : null;
      })}
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          width: '100%',
          textAlign: 'center',
          color: t.nightInkSoft,
          fontSize: 30,
          letterSpacing: 3,
          opacity: fadeIn(frame, sec(2.4), sec(0.5)),
        }}
      >
        {C.glitch.sub}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 场景 2 · Decode 解码（5-10s）：乱码逐字锁定成真话
// ============================================================
export const DecodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 0, dur('decode'), sec(0.4));
  return (
    <AbsoluteFill style={{ background: t.nightBg, fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.04} />
      <div style={{ position: 'absolute', top: 620, left: 90, right: 90 }}>
        <DecodeText text={C.decode.line1} start={0.2} step={0.09} fontSize={62} />
        <div style={{ height: 40 }} />
        <DecodeText
          text={C.decode.line2}
          start={1.5}
          step={0.08}
          fontSize={62}
          color={t.nightAmber}
        />
      </div>
      {/* 左侧扫描光标 */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 78,
          width: 2,
          height: 520,
          background: t.nightAmber,
          opacity: fadeIn(frame, 0, sec(0.3)) * (frame % 24 < 12 ? 0.7 : 0.15),
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// 场景 3 · 数字滚动（10-15s）：数字增长 + squash 弹跳
// ============================================================
export const NumbersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 0, dur('numbers'), sec(0.4));
  return (
    <AbsoluteFill style={{ background: t.nightSurface, fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.04} />
      <div
        style={{
          position: 'absolute',
          top: 220,
          width: '100%',
          textAlign: 'center',
          color: t.nightInkSoft,
          fontSize: 40,
          letterSpacing: 4,
          ...riseIn(frame, sec(0.1), 20),
        }}
      >
        {C.numbers.heading}
      </div>
      <div style={{ position: 'absolute', top: 400, left: 90, right: 90 }}>
        {C.numbers.items.map((item, i) => {
          const start = 0.7 + i * 1.3;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 28,
                marginBottom: 70,
                opacity: fadeIn(frame, sec(start), sec(0.3)),
              }}
            >
              <CountUp value={item.value} start={start} duration={1.1} fontSize={132} suffix={item.suffix} />
              <span style={{ color: t.nightInk, fontSize: 44, lineHeight: 1.4 }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 场景 4 · 荧光笔标注（15-21s）：手绘高亮 + 红圈 + 证据
// ============================================================
export const HighlightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 0, dur('highlight'), sec(0.4));
  return (
    <AbsoluteFill style={{ background: t.paperBg, fontFamily: FONT_FAMILY, opacity }}>
      <Grain opacity={0.05} />
      <div
        style={{
          position: 'absolute',
          top: 300,
          width: '100%',
          textAlign: 'center',
          color: t.paperInk,
          fontSize: 52,
          fontWeight: 600,
          ...riseIn(frame, sec(0.1), 24),
        }}
      >
        {C.highlight.line}
      </div>

      {/* 手写纸面 */}
      <div
        style={{
          position: 'absolute',
          top: 620,
          left: 100,
          right: 100,
          padding: '70px 60px',
          background: t.paperSurface,
          border: `2px solid ${t.paperLine}`,
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(42,38,34,0.08)',
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <MarkerHighlight start={0.9} duration={0.6} color={t.paperAmber}>
            <span style={{ color: t.paperInk, fontSize: 60, fontWeight: 600 }}>
              {C.highlight.marked}
            </span>
          </MarkerHighlight>
          <div style={{ position: 'absolute', top: -18, left: -30, width: 560, height: 110, opacity: fadeIn(frame, sec(1.6), sec(0.5)) }}>
            <HandDrawnCircle start={1.6} color="#D9534F" />
          </div>
        </div>
        <div
          style={{
            marginTop: 50,
            color: t.paperInkSoft,
            fontSize: 38,
            opacity: fadeIn(frame, sec(2.2), sec(0.5)),
          }}
        >
          {C.highlight.note}
        </div>
        <div
          style={{
            marginTop: 30,
            color: t.paperMoss,
            fontSize: 34,
            letterSpacing: 2,
            opacity: fadeIn(frame, sec(2.8), sec(0.5)),
          }}
        >
          {C.highlight.evidence}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 场景 5 · 年轮幕布转场（21-26s）：群体遮蔽 + 峰值硬切
// ============================================================
export const CurtainScene: React.FC = () => {
  const frame = useCurrentFrame();
  // 0-2s 涨大遮屏，2-2.4s 峰值（硬切点），2.4-5s 散开
  const grow = interpolate(frame, [0, sec(2)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shrink = interpolate(frame, [sec(2.4), sec(4.6)], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const progress = Math.min(grow, shrink);
  const switched = frame >= sec(2); // 峰值处硬切

  return (
    <AbsoluteFill style={{ background: t.nightBg, fontFamily: FONT_FAMILY }}>
      <RingCurtain progress={progress} color={t.nightAmber} side="left" />
      <RingCurtain progress={progress} color={t.nightMoss} side="right" />
      {/* 峰值遮蔽时露出的品牌信息 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: interpolate(frame, [sec(1.8), sec(2.2)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }) * interpolate(frame, [sec(3.3), sec(4)], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div style={{ color: t.nightInkSoft, fontSize: 40, letterSpacing: 6, marginBottom: 30 }}>
          {switched ? C.curtain.after : C.curtain.before}
        </div>
        <KineticWord text="年轮" start={2} color={t.nightAmber} fontSize={180} />
        <div style={{ color: t.nightInk, fontSize: 36, letterSpacing: 3, marginTop: 40 }}>
          {C.curtain.slogan}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 场景 6 · 清晰收尾（26-30s）：从 Glitch 残留回归纯净 + CTA
// ============================================================
export const ClarityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 0, dur('clarity'), sec(0.7));
  return (
    <AbsoluteFill style={{ background: t.nightBg, fontFamily: FONT_FAMILY, opacity }}>
      <div style={{ position: 'absolute', top: 760, left: '50%', marginLeft: -300, opacity: 0.5 }}>
        <RingMark size={600} color={t.nightAmber} breathe={0} rotate={8} />
      </div>
      <div style={{ position: 'absolute', top: 420, width: '100%', textAlign: 'center' }}>
        {C.clarity.lines.map((line, i) => (
          <div
            key={i}
            style={{
              color: i === 0 ? t.nightInkSoft : t.nightMoss,
              fontSize: 44,
              lineHeight: 1.9,
              ...riseIn(frame, sec(0.2) + i * sec(0.5), 24),
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 1060, width: '100%', textAlign: 'center' }}>
        <div
          style={{
            color: t.nightInk,
            fontSize: 130,
            fontWeight: 700,
            letterSpacing: 16,
            opacity: fadeIn(frame, sec(1.4), sec(0.5)),
          }}
        >
          {C.clarity.cta}
        </div>
        <div
          style={{
            color: t.nightAmber,
            fontSize: 36,
            letterSpacing: 3,
            marginTop: 20,
            opacity: fadeIn(frame, sec(2), sec(0.5)),
          }}
        >
          {C.clarity.sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
