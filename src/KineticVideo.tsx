import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { theme } from './theme';
import { kineticFrames } from './kinetic/timeline';
import {
  GlitchScene,
  DecodeScene,
  NumbersScene,
  HighlightScene,
  CurtainScene,
  ClarityScene,
} from './kinetic/KineticScenes';

const COMPONENTS = {
  glitch: GlitchScene,
  decode: DecodeScene,
  numbers: NumbersScene,
  highlight: HighlightScene,
  curtain: CurtainScene,
  clarity: ClarityScene,
} as const;

/** 第二款视频：30 秒强动效版，与第一款共用字体和主题 */
export const KineticTimeline: React.FC = () => (
  <AbsoluteFill style={{ background: theme.nightBg }}>
    {kineticFrames.map((scene) => {
      const Scene = COMPONENTS[scene.id];
      return (
        <Sequence
          key={scene.id}
          from={scene.fromFrame}
          durationInFrames={scene.durationFrames}
        >
          <Scene />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
