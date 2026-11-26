import React from 'react';

/**
 * 纸张颗粒质感：一层低透明度的 SVG 噪点，铺满画面，
 * 让纯色背景不那么"数字感"。用 feTurbulence 生成，无外部资源。
 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      opacity,
      mixBlendMode: 'overlay',
    }}
  >
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);
