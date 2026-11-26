import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// 霞鹜文楷：整个视频统一使用的字体，跟随 App 内嵌字体保持一致。
// 字体文件放在 public/fonts/ 下，loadFont 内部会 delayRender，
// 保证字体加载完成后才开始渲染，不会出现"方块字"或字体跳变。
export const FONT_FAMILY = 'LXGWWenKai';

loadFont({
  family: FONT_FAMILY,
  url: staticFile('fonts/LXGWWenKai-Regular.ttf'),
  weight: '400',
});
