# 年轮宣传视频 · 本地写码 / Colab 渲染工作流

一套竖屏 9:16 的宣传视频：本地改代码和文案，推到 GitHub，在 Colab 上渲染出 MP4。
Remotion 渲染吃 CPU，本地机器跑全片会很慢，Colab 免费算力足够——代码和渲染解耦，
两边只通过 Git 仓库传递。

**这是独立项目**，与 Flutter App（growth_ring）分开，目录 `C:/dev/growth_ring_promo`。

## 叙事结构（重点）

开头不做功能罗列，用一条冲突式钩子留人：

1. **钩子**：「它说我『怕被落下』。」→「我删了这句话。」（删除线划过）
2. **反转**：「第二天，它又写了回来。」→ 三行原文证据逐条浮现
3. **揭晓**：「这不是算命。」→「这是一本会反驳你的日记本。」+ 年轮 Logo
4. **功能**：写 / 懂 / 导出（快节奏，每 6-9 秒一个）
5. **收尾**：隐私主张 + CTA

核心策略是**反讨好**：满世界的 AI 都在夸你，这本日记偏要说你不爱听的，
而且每句话都拿你写过的原文当证据。这是产品最反常识、最值得传播的一点。

## 目录结构

```
growth_ring_promo/
├── src/
│   ├── index.ts          入口：注册 Root
│   ├── Root.tsx          合成配置 + defaultProps
│   ├── Video.tsx         七段式时间轴：顺序由 timeline.ts 决定
│   ├── timeline.ts       ★ 各场景起止时间（秒），改节奏只动这里
│   ├── config.tsx        ★ 视频配置类型 + Context（文案/配色/品牌注入）
│   ├── content.ts        默认文案（变体未覆盖时的基底）
│   ├── theme.ts          配色 + 帧率 + sec() 秒转帧工具
│   ├── fonts.ts          字体加载（霞鹜文楷）
│   ├── anim.ts           动画工具函数
│   ├── scenes/           七个场景组件（用 useConfig 读配置）
│   │   ├── Hook.tsx / Reveal.tsx / Reveal2.tsx   钩子三连
│   │   └── Write / Understand / Export / Outro
│   └── components/       年轮母题、纸张颗粒、逐字打字组件
├── variants/             ★ 每个 JSON 是一个视频变体
│   ├── default.json      基底配置（完整）
│   ├── moss.json         示例：青苔绿配色版
│   └── privacy.json      示例：隐私卖点文案版
├── render-batch.mjs      ★ 批量渲染脚本
├── colab_render.ipynb    ★ 上传到 Colab 的渲染 notebook
├── public/fonts/         字体文件（随仓库同步，Colab 不用管）
└── out/                  渲染产物（已 gitignore）
```

## 一、本地：写代码 + 预览

环境要求：Node >= 16（推荐 18+）。

```bash
cd C:/dev/growth_ring_promo
npm install                 # 首次安装依赖
npm start                   # 打开 Remotion Studio，浏览器里实时预览、逐帧调试
npm run typecheck           # 类型检查
```

### 调节奏 / 换帧率

所有时间都以**秒**定义，改一处即可：

- 改场景起止/时长 → `src/timeline.ts`（当前总长 48 秒）
- 改帧率（默认 24fps）→ `src/theme.ts` 的 `fps`，`sec()` 自动换算所有动画时点
- 改默认文案 → `src/content.ts`
- 改默认配色 → `src/theme.ts` 的 `theme` 对象

确认效果后推到 GitHub（仓库地址见下文，需先建远程）：

```bash
git add .
git commit -m "update promo video"
git push origin main
```

> Colab 拉的是远程仓库，所以**必须先 push**，否则渲染的还是旧代码。

## 二、批量产出视频（核心）

一份代码产出任意多个变体——不同文案、配色、品牌名。

### 新增变体

在 `variants/` 下复制 `default.json` 改名，**只写要覆盖的字段**：

```json
{
  "output": "growth-ring-christmas.mp4",
  "brand": { "slogan": "给这一年，留一本自己的书" },
  "palette": { "nightAmber": "#C0392B" },
  "content": {
    "hook": { "line1": "这一年，", "line2": "值得被好好记住。" }
  }
}
```

注意：钩子场景 `hook` 需要 `line1`/`line2` 两行，`reveal` 需要 `line1`/`line2` + 三条 `evidence`，
结构见 `variants/default.json`。

### 执行

```bash
node render-batch.mjs                      # 全部变体
node render-batch.mjs moss privacy         # 指定变体
node render-batch.mjs --concurrency=2      # 指定并发
node render-batch.mjs --scale=0.5          # 降分辨率快速出样片
node render-batch.mjs --frames=0-119       # 只渲某段
```

产物在 `out/`，每个变体一个 MP4。

## 三、Colab：渲染 + 下载

1. 打开 [Google Colab](https://colab.research.google.com/)，`文件 → 上传 notebook`，
   选择 `colab_render.ipynb`。
2. 确认已连接运行时。
3. 按顺序运行：① 环境+并发 → ② 拉代码 → ③ 依赖缓存到 Drive → ④ 快速预览 →
   ⑤ 正式渲染 / ⑤b 批量渲染 → ⑥ 下载。
4. 改了代码后重新 push，再从 ② 重跑。

> **仓库地址**：notebook ②里的 `REPO_URL` 目前指向旧地址，建好新仓库后要改成实际的
> `https://github.com/<用户名>/<新仓库>.git`。私有仓库需带 PAT：
> `https://<用户名>:<PAT>@github.com/<仓库>.git`

### 常见坑

- **字体变方块**：`public/fonts/` 的 ttf 必须随仓库同步；改了忘 push 就会出现。
- **Chrome 下载失败**：首次渲染会下载 Chrome Headless Shell（约 150MB），受限网络下先跑
  `npx remotion browser ensure`。
- **缓存依赖版本不对**：改了 `package.json` 后把 notebook③的 `USE_CACHE=False` 跑一次重建。
- **渲染太慢**：批量渲染分批做，或用 `--scale=0.75`。
- **所有 @remotion/* 版本必须一致**：升级时不要只升一个包。

## 四、本地直接渲染

```bash
npm run still    # 单帧静图
npm run render   # 全片
npm run render:batch
```
