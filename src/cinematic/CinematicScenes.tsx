import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { cinematicContent as C } from './content';
import { sceneFrames } from './timeline';
import { FONT_FAMILY } from '../fonts';
import { theme } from '../theme';
import {
  CinematicCamera,
  Depth,
  Rings,
  FlyText,
  ForegroundSweep,
  LightLeak,
  FilmGrain,
  Caption,
  camPath,
  fadeWindow,
} from './camera';

/** 场景1：深潜——镜头从年轮远处持续推进，文字在不同深度依次浮现。 */
export const Dive: React.FC = () => {
  const frame = useFrame();
  const t = sceneFrames.dive;
  const cam = camPath(frame, [
    { f: 0, scale: 0.72, y: 90, roll: -2.5 },
    { f: t * 0.6, scale: 1.08, y: 0, roll: 0.8 },
    { f: t, scale: 1.45, y: -40, roll: 2 },
  ]);
  return (
    <CinematicCamera state={cam}>
      <Depth z={-520}>
        <Rings frame={frame} color={theme.nightMoss} count={16} spin={0.035} base={80} gap={54} opacity={0.55} />
      </Depth>
      <Depth z={-60}>
        <Rings frame={frame * 0.7} color={theme.nightAmber} count={11} spin={-0.05} base={120} gap={70} opacity={0.85} />
      </Depth>
      <FlyText text={C.dive.eyebrow} frame={frame} start={4} duration={26} fromZ={-500} toZ={-120} y={-260} color={theme.nightInkSoft} fontSize={40} weight={400}  fadeOut={sceneFrames.dive - 24} />
      <FlyText text={C.dive.headline} frame={frame} start={16} duration={34} fromZ={-420} toZ={40} y={-40} color={theme.nightInk} fontSize={104}  fadeOut={sceneFrames.dive - 14} />
      <FlyText text={C.dive.sub} frame={frame} start={40} duration={30} fromZ={-360} toZ={-40} y={190} color={theme.nightAmber} fontSize={44} weight={400}  fadeOut={sceneFrames.dive - 10} />
      <LightLeak frame={frame} intensity={0.1} />
      <ForegroundSweep frame={frame} start={t - 34} duration={40} fromX={900} toX={-900} size={760} color={theme.nightSurfaceHi} blur={70} />
      <FilmGrain frame={frame} />
    </CinematicCamera>
  );
};

/** 场景2：文字从空间深处朝镜头飞来，一条比一条近，最后一条擦过画面。 */
export const Fly: React.FC = () => {
  const frame = useFrame();
  const t = sceneFrames.fly;
  const cam = camPath(frame, [
    { f: 0, scale: 1.3, y: -40, roll: 1.6 },
    { f: t * 0.5, scale: 1.12, x: -30, y: 10, roll: -0.6 },
    { f: t, scale: 1.32, x: 40, roll: -1.8 },
  ]);
  return (
    <CinematicCamera state={cam}>
      <Depth z={-700}>
        <Rings frame={frame * 0.5} color={theme.nightLine} count={9} spin={0.02} base={200} gap={90} opacity={0.4} />
      </Depth>
      <FlyText text={C.fly.lines[0]} frame={frame} start={2} duration={44} fromZ={-700} toZ={60} y={-230} color={theme.nightInkSoft} fontSize={58} weight={500} rotate={-3}  fadeOut={sceneFrames.fly - 30} />
      <FlyText text={C.fly.lines[1]} frame={frame} start={34} duration={44} fromZ={-720} toZ={140} y={10} color={theme.nightInk} fontSize={80} rotate={2}  fadeOut={sceneFrames.fly - 20} />
      <FlyText text={C.fly.lines[2]} frame={frame} start={72} duration={46} fromZ={-760} toZ={260} y={250} color={theme.nightAmber} fontSize={92} rotate={-2}  fadeOut={sceneFrames.fly - 10} />
      <Caption text={C.fly.kicker} opacity={fadeWindow(frame, 120, 20, t - 6, 24)} top="86%" />
      <LightLeak frame={frame} intensity={0.12} x={-180} />
      <ForegroundSweep frame={frame} start={t - 40} duration={44} fromX={-1100} toX={1100} size={820} color={theme.nightSurface} blur={80} />
      <FilmGrain frame={frame} />
    </CinematicCamera>
  );
};

/** 场景3：画像卡片悬浮在不同深度，镜头横移穿过它们，近处卡片遮挡远处。 */
export const Space: React.FC = () => {
  const frame = useFrame();
  const t = sceneFrames.space;
  const cam = camPath(frame, [
    { f: 0, scale: 1.12, x: 70, roll: -1.2 },
    { f: t * 0.5, scale: 0.92, x: -10, roll: 0.3 },
    { f: t, scale: 1.08, x: -70, roll: 0.9 },
  ]);
  const cardOp = fadeWindow(frame, 12, 22, t - 6, 26);
  const zs = [-360, -60, 220];
  const ys = [-280, 0, 290];
  return (
    <CinematicCamera state={cam}>
      <Depth z={-800}>
        <Rings frame={frame * 0.4} color={theme.nightMoss} count={10} spin={0.015} base={260} gap={100} opacity={0.32} />
      </Depth>
      <Caption text={C.space.title} opacity={fadeWindow(frame, 4, 20, t - 4, 24)} top="12%" color={theme.nightInk} fontSize={56} />
      {C.space.fields.map((f, i) => {
        const enter = interpolate(frame, [18 + i * 26, 50 + i * 26], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate3d(${(i - 1) * 70}px, ${ys[i]}px, ${zs[i]}px) rotateY(${(1 - i) * 9}deg) scale(${0.85 + enter * 0.15})`,
              transformStyle: 'preserve-3d',
              width: 700,
              padding: '40px 48px',
              borderRadius: 24,
              background: theme.nightSurface,
              border: `1px solid ${theme.nightLine}`,
              boxShadow: `0 30px 80px rgba(0,0,0,${0.35 + (i / 3) * 0.3})`,
              opacity: enter * cardOp,
            }}
          >
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 30, color: theme.nightInkSoft, letterSpacing: 3 }}>
              {f.label}
            </div>
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 66, color: i === 2 ? theme.nightAmber : theme.nightInk, marginTop: 12, fontWeight: 700 }}>
              {f.value}
            </div>
          </div>
        );
      })}
      <Caption text={C.space.note} opacity={fadeWindow(frame, 150, 22, t - 4, 24)} top="90%" color={theme.nightMoss} fontSize={32} />
      <LightLeak frame={frame} intensity={0.08} x={220} />
      <FilmGrain frame={frame} />
    </CinematicCamera>
  );
};

/** 场景4：书页从镜头前翻过（纸面近景扫过），露出装订好的小书。 */
export const Book: React.FC = () => {
  const frame = useFrame();
  const t = sceneFrames.book;
  const cam = camPath(frame, [
    { f: 0, scale: 1.25, y: 60, roll: 1.2 },
    { f: t * 0.55, scale: 0.96, y: -10, roll: -0.5 },
    { f: t, scale: 1.1, y: -50, roll: -1 },
  ]);
  // 书页翻过镜头：rotateY 从 0 到 -155，翻到 90° 时遮住画面
  const pageTurn = interpolate(frame, [t * 0.3, t * 0.72], [0, -155], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <CinematicCamera state={cam} background={theme.paperBg}>
      <Depth z={-260}>
        <Rings frame={frame * 0.5} color={theme.paperAmber} count={8} spin={0.02} base={180} gap={80} opacity={0.3} />
      </Depth>
      {/* 摊开的小书：两页纸在不同深度 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) translateZ(-40px)',
          transformStyle: 'preserve-3d',
          width: 900,
          height: 1100,
          background: theme.paperSurface,
          borderRadius: 8,
          boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
          padding: '80px 70px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 40, color: theme.paperInkSoft, marginBottom: 60, letterSpacing: 4 }}>
          年轮 · 第一卷
        </div>
        {[C.book.line1, C.book.line2].map((line, i) => (
          <div key={i} style={{ fontFamily: FONT_FAMILY, fontSize: 52, color: theme.paperInk, lineHeight: 1.7, marginBottom: 36, opacity: fadeWindow(frame, 30 + i * 34, 24, t - 8, 28) }}>
            {line}
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: 70, left: 70, right: 70, height: 1, background: theme.paperLine }} />
        <div style={{ position: 'absolute', bottom: 40, left: 70, fontFamily: FONT_FAMILY, fontSize: 28, color: theme.paperInkSoft, opacity: fadeWindow(frame, 110, 24, t - 6, 26) }}>
          {C.book.footer}
        </div>
      </div>
      {/* 翻页：一张纸从右侧翻过来，近景遮挡镜头 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 900,
          height: 1100,
          transformOrigin: 'left center',
          transform: `translate(-50%, -50%) translateZ(360px) rotateY(${pageTurn}deg)`,
          transformStyle: 'preserve-3d',
          background: `linear-gradient(105deg, ${theme.paperSurfaceHi} 0%, ${theme.paperSurface} 60%)`,
          borderRadius: 8,
          boxShadow: '18px 20px 70px rgba(0,0,0,0.28)',
          backfaceVisibility: 'hidden',
        }}
      />
      <FilmGrain frame={frame} opacity={0.035} />
    </CinematicCamera>
  );
};

/** 场景5：镜头拉远，从纸面退回夜色，年轮与品牌浮现，收尾。 */
export const Outro: React.FC = () => {
  const frame = useFrame();
  const t = sceneFrames.outro;
  const cam = camPath(frame, [
    { f: 0, scale: 1.6, roll: -1 },
    { f: t * 0.55, scale: 1.0, roll: 0 },
    { f: t, scale: 0.86, roll: 0.6 },
  ]);
  return (
    <CinematicCamera state={cam}>
      <Depth z={-500}>
        <Rings frame={frame} color={theme.nightAmber} count={15} spin={0.04} base={90} gap={62} opacity={0.8} />
      </Depth>
      <FlyText text={C.outro.privacy1} frame={frame} start={2} duration={30} fromZ={-460} toZ={-30} y={-200} color={theme.nightInk} fontSize={54} weight={500}  fadeOut={sceneFrames.outro - 6} />
      <FlyText text={C.outro.privacy2} frame={frame} start={16} duration={32} fromZ={-440} toZ={-10} y={-60} color={theme.nightMoss} fontSize={46} weight={400}  fadeOut={sceneFrames.outro - 6} />
      <FlyText text={C.outro.brand} frame={frame} start={40} duration={36} fromZ={-380} toZ={120} y={130} color={theme.nightInk} fontSize={150}  fadeOut={sceneFrames.outro - 4} />
      <Caption text={C.outro.slogan} opacity={fadeWindow(frame, 70, 18, t - 2, 22)} top="80%" color={theme.nightInkSoft} fontSize={36} />
      <Caption text={C.outro.cta} opacity={fadeWindow(frame, 82, 18, t - 2, 22)} top="90%" color={theme.nightAmber} fontSize={30} />
      <LightLeak frame={frame} intensity={0.16} />
      <FilmGrain frame={frame} />
    </CinematicCamera>
  );
};

// 用 Sequence 内的相对帧。为避免每个场景重复写，这里统一封装。
function useFrame() {
  return useCurrentFrame();
}
