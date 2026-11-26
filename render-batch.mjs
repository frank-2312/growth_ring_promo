#!/usr/bin/env node
/**
 * 批量渲染：一份代码，多个视频变体。
 *
 * 用法：
 *   node render-batch.mjs                    # 渲染 variants/ 下全部变体
 *   node render-batch.mjs moss privacy       # 只渲染指定变体（按文件名）
 *   node render-batch.mjs --concurrency=2    # 指定并发
 *   node render-batch.mjs --scale=0.75       # 降分辨率（快速出样片）
 *   node render-batch.mjs --frames=0-119     # 只渲某段（快速验证/分段渲染）
 *
 * 每个变体 JSON 只需写「要覆盖的字段」，脚本会与 default.json 深合并。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const VARIANTS_DIR = path.join(ROOT, 'variants');
const OUT_DIR = path.join(ROOT, 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---- 解析参数 ----
const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const names = args.filter((a) => !a.startsWith('--'));
const flag = (key, fallback) => {
  const hit = flags.find((f) => f.startsWith(`--${key}=`));
  return hit ? hit.split('=')[1] : fallback;
};
const concurrency = flag('concurrency', process.env.CONCURRENCY || '4');
const scale = flag('scale', null);
const frames = flag('frames', null);
const isWindows = process.platform === 'win32';

// ---- 深合并：变体只需写差异字段 ----
const merge = (base, over) => {
  if (Array.isArray(over)) return over;
  if (over && typeof over === 'object') {
    const out = { ...(base ?? {}) };
    for (const k of Object.keys(over)) out[k] = merge(base?.[k], over[k]);
    return out;
  }
  return over;
};

// ---- 读基底配置 ----
const basePath = path.join(VARIANTS_DIR, 'default.json');
const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));

// ---- 选出要渲染的变体 ----
let files = fs
  .readdirSync(VARIANTS_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort();
if (names.length) {
  files = files.filter((f) => names.includes(path.basename(f, '.json')));
  if (!files.length) {
    console.error(`没有匹配的变体：${names.join(', ')}`);
    process.exit(1);
  }
}

console.log(`准备渲染 ${files.length} 个变体：${files.join(', ')}`);

let failed = 0;
for (const file of files) {
  const name = path.basename(file, '.json');
  const override = JSON.parse(fs.readFileSync(path.join(VARIANTS_DIR, file), 'utf8'));
  const config = merge(base, override);
  const output = override.output || `${name}.mp4`;

  // Remotion 的 props 必须是 JSON 文件（Windows 下内联 JSON 会被 shell 吃掉引号）
  const propsFile = path.join(OUT_DIR, `.props-${name}.json`);
  fs.writeFileSync(propsFile, JSON.stringify({ config }), 'utf8');

  const cmd = [
    'remotion',
    'render',
    'src/index.ts',
    'GrowthRingPromo',
    path.join('out', output),
    `--props=${path.relative(ROOT, propsFile).replace(/\\/g, '/')}`,
    '--codec=h264',
    `--concurrency=${concurrency}`,
    '--log=error',
  ];
  if (scale) cmd.push(`--scale=${scale}`);
  if (frames) cmd.push(`--frames=${frames}`);

  console.log(`\n=== 渲染 ${name} → out/${output} ===`);
  const r = spawnSync(isWindows ? 'npx.cmd' : 'npx', cmd, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: isWindows,
  });
  if (r.status !== 0) failed++;

  // 清理临时 props
  fs.rmSync(propsFile, { force: true });
}

if (failed) {
  console.error(`\n${failed} 个变体渲染失败。`);
  process.exit(1);
}
console.log('\n全部变体渲染完成。');
