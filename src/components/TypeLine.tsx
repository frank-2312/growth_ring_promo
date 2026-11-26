import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { sec } from '../theme';

type TypeLineProps = {
  text: string;
  start: number; // 秒
  charSeconds?: number; // 每个字间隔秒数
  style?: React.CSSProperties;
  cursor?: boolean;
};

/**
 * 逐字打字：按秒推进可见字数，与帧率无关。
 * 打字时的光标闪烁也按秒计算。
 */
export const TypeLine: React.FC<TypeLineProps> = ({
  text,
  start,
  charSeconds = 0.15,
  style,
  cursor = true,
}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  const visible = Math.floor(
    interpolate(
      frame,
      [sec(start), sec(start) + chars.length * sec(charSeconds)],
      [0, chars.length],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  );
  const typing = visible < chars.length && frame >= sec(start);
  const blink = Math.floor(frame / sec(0.5)) % 2 === 0;

  return (
    <span style={style}>
      {chars.slice(0, visible).join('')}
      {cursor && typing && blink ? '▍' : ''}
    </span>
  );
};
