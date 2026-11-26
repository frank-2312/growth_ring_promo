import { Config } from '@remotion/cli/config';

// 所有 @remotion/* 包版本必须与 remotion 本体严格一致，见 package.json
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Colab 无 GPU，用 CPU 渲染；并发 4 在免费额度下比较稳
Config.setConcurrency(4);
