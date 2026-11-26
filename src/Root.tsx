import React from 'react';
import { Composition } from 'remotion';
import { Timeline } from './Video';
import { fps, width, height, durationInFrames } from './theme';
import { defaultConfig, VideoConfig } from './config';
import './fonts'; // 触发字体加载（模块副作用）

export const RemotionRoot: React.FC = () => (
  <Composition
    id="GrowthRingPromo"
    component={Timeline}
    durationInFrames={durationInFrames}
    fps={fps}
    width={width}
    height={height}
    defaultProps={{ config: defaultConfig } as { config: VideoConfig }}
  />
);
