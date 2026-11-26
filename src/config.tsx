import React, { createContext, useContext } from 'react';
import { content as defaultContent } from './content';
import { theme } from './theme';

/**
 * 视频配置：一份 JSON 就是一个视频变体。
 * 批量产出时，每个变体提供自己的 content / palette / brand，
 * 通过 Remotion 的 --props 注入，组件用 useConfig() 读取。
 */

export type PaletteKey = keyof typeof theme;

export type VideoConfig = {
  /** 全部文案，结构见 content.ts */
  content: typeof defaultContent;
  /** 配色覆盖：只写要改的 key，其余用默认主题 */
  palette: Partial<Record<PaletteKey, string>>;
  /** 品牌信息：开场与收尾会用到 */
  brand: {
    name: string;
    slogan: string;
    packageName: string;
  };
  /** 输出文件名（批量脚本用，组件本身不消费） */
  output?: string;
};

// 默认配置：就是当前这版视频，作为 Studio 预览和兜底
export const defaultConfig: VideoConfig = {
  content: defaultContent,
  palette: {},
  brand: {
    name: '年轮',
    slogan: '一本会越来越懂你的日记本',
    packageName: '年轮 · growth_ring',
  },
};

const ConfigContext = createContext<VideoConfig>(defaultConfig);

export const ConfigProvider: React.FC<{
  config: VideoConfig;
  children: React.ReactNode;
}> = ({ config, children }) => (
  <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
);

/**
 * 取当前视频配置。返回合并好默认值的 content / palette / brand。
 * 场景组件统一用它，不要直接 import content 或 theme。
 */
export const useConfig = () => {
  const config = useContext(ConfigContext);
  const colors = { ...theme, ...config.palette } as typeof theme;
  return {
    content: config.content,
    colors,
    brand: { ...defaultConfig.brand, ...config.brand },
  };
};
