import React from 'react';
import { Composition } from 'remotion';
import { Timeline } from './Video';
import { KineticTimeline } from './KineticVideo';
import { fps, width, height, durationInFrames } from './theme';
import { kineticTotalFrames } from './kinetic/timeline';
import { defaultConfig, VideoConfig } from './config';
import './fonts'; // 触发字体加载（模块副作用）

export const RemotionRoot: React.FC = () => (
  <>
    {/* 第一款：冲突钩子叙事版（48 秒） */}
    <Composition
      id="GrowthRingPromo"
      component={Timeline}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
      defaultProps={{ config: defaultConfig } as { config: VideoConfig }}
    />
    {/* 第二款：强动效冲击版（30 秒） */}
    <Composition
      id="GrowthRingKinetic"
      component={KineticTimeline}
      durationInFrames={kineticTotalFrames}
      fps={fps}
      width={width}
      height={height}
    />
  </>
);
