import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { theme } from './theme';
import { sceneFrames } from './timeline';
import { ConfigProvider, defaultConfig, VideoConfig } from './config';
import { Hook } from './scenes/Hook';
import { Reveal } from './scenes/Reveal';
import { Reveal2 } from './scenes/Reveal2';
import { Write } from './scenes/Write';
import { Understand } from './scenes/Understand';
import { Export } from './scenes/Export';
import { Outro } from './scenes/Outro';

// 场景组件与 timeline 里 id 的映射。顺序由 timeline.ts 决定。
const COMPONENTS = {
  hook: Hook,
  reveal: Reveal,
  reveal2: Reveal2,
  write: Write,
  understand: Understand,
  export: Export,
  outro: Outro,
} as const;

export const Timeline: React.FC<{ config?: VideoConfig }> = ({ config }) => (
  <ConfigProvider config={config ?? defaultConfig}>
    <AbsoluteFill style={{ background: theme.nightBg }}>
      {sceneFrames.map((scene) => {
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
  </ConfigProvider>
);
