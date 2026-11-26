// 取自 App 的 lib/core/theme.dart，保证视频和产品的气质一致：
// 纸与墨、苔与琥珀。整体压低饱和度，只有强调色带一点温度。
export const theme = {
  // 深色（夜灯下写字）——主背景
  nightBg: '#14120F',
  nightSurface: '#1D1A16',
  nightSurfaceHi: '#26221C',
  nightLine: '#332E26',
  nightInk: '#EDE6DA',
  nightInkSoft: '#9C948A',
  nightAmber: '#C9A227',
  nightMoss: '#8FA98A',

  // 浅色（宣纸）——用于"写"的纸面段落和结尾
  paperBg: '#FAF7F2',
  paperSurface: '#FFFFFF',
  paperSurfaceHi: '#F3EEE6',
  paperLine: '#E5DDD1',
  paperInk: '#2A2622',
  paperInkSoft: '#7A7167',
  paperAmber: '#A8874F',
  paperMoss: '#6B8464',
} as const;

export const fps = 24;
export const width = 1080;
export const height = 1920;

/**
 * 秒 → 帧。所有动画时点都用秒表达，改 fps 时自动换算，
 * 不用去每个场景里数字数。
 */
export const sec = (seconds: number) => Math.round(seconds * fps);

export const durationInFrames = sec(48); // 48 秒
