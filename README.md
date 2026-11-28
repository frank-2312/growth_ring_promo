# 年轮宣传视频 · 本地写码 / Colab 渲染工作流

一套竖屏 9:16 的宣传视频：**本地改代码和文案，推到 GitHub，在 Colab 上渲染出 MP4**。
Remotion 渲染吃 CPU，本地机器跑全片慢，Colab 免费算力足够——代码和渲染解耦，
两边只通过 Git 仓库传递。

**这是独立项目**，与 Flutter App（growth_ring）分开，目录 `C:/dev/growth_ring_promo`。

## 三款视频

同一个项目里注册了三个 composition，共用字体、主题、依赖，只是镜头语言不同：

| | **第一款 · 冲突钩子版** | **第二款 · 强动效版** | **第三款 · 电影运镜版** |
|---|---|---|---|
| Composition ID | `GrowthRingPromo` | `GrowthRingKinetic` | `GrowthRingCinematic` |
| 时长 | 48 秒 / 7 场景 | 30 秒 / 6 场景 | 37 秒 / 5 镜头 |
| 风格 | 慢叙事、悬念-反转-揭晓 | 快节奏、强冲击、科技感 | 连续镜头、3D 纵深、空间感 |
| 动效 | 逐字打字、删除线、证据卡片、翻页 | Glitch 色差、Decode 解码、数字滚动、荧光笔标注 | 摄像机推拉/摇移/滚转、多层视差、前景遮挡、文字在深度间飞行 |
| 文案位置 | `src/content.ts` | `src/kinetic/content.ts` | `src/cinematic/content.ts` |
| Colab notebook | `colab_render.ipynb` | `colab_render_kinetic.ipynb` | `colab_render_cinematic.ipynb` |
| 批量变体 | 支持（`variants/*.json`） | 暂不支持 | 暂不支持 |

三款可以都渲染，按投放渠道选：第一款适合完整介绍产品理念，第二款适合信息流里抓眼球，
第三款适合当作品牌片——它不像幻灯片，而是"拍出来的一段镜头"。

### 第一款叙事（冲突钩子）

1. **钩子**：「它说我『怕被落下』。」→「我删了这句话。」（删除线划过）
2. **反转**：「第二天，它又写了回来。」→ 三行原文证据逐条浮现
3. **揭晓**：「这不是算命。」→「这是一本会反驳你的日记本。」+ 年轮 Logo
4. **功能**：写 / 懂 / 导出（快节奏，每 6-9 秒一个）
5. **收尾**：隐私主张 + CTA

核心策略是**反讨好**：满世界的 AI 都在夸你，这本日记偏要说你不爱听的，
而且每句话都拿你写过的原文当证据。

### 第二款叙事（强动效）

1. **Glitch 钩子**：「它在偷偷给你画像。」— 红青色差撕裂 + 扫描线 + 噪点条
2. **Decode 解码**：乱码逐字锁定成「形成一个可以被推翻的假设」
3. **数字滚动**：183 篇日记 / 47 次推翻 / 1 个假设，数字增长 + squash 弹跳
4. **荧光笔标注**：手绘黄高亮扫过「说不在乎是假的」+ 红圈 + 日期证据
5. **幕布转场**：年轮群涨大遮满屏，峰值硬切露出品牌
6. **清晰收尾**：从故障回归纯净，隐私主张 + CTA

动效全部是纯 CSS/SVG 实现，无额外依赖；所有动画基于 frame 确定性计算，
不用 `Math.random`，保证本地预览和 Colab 渲染逐帧一致。

### 第三款叙事（电影运镜）

与前两款的本质区别：**画面是一个 3D 空间，有一台虚拟摄像机持续运动**。
前两款是"设计一屏屏画面 + 元素淡入"，第三款是"设计一个连续运动的镜头"——
近处的年轮擦过镜头、文字从纵深飞向观众、书页翻过时遮挡画面，全程有视差和景深。

1. **深潜**：镜头穿过层层年轮推进，文字在不同深度依次浮现
2. **飞行**：三句话从空间深处朝镜头飞来，一条比一条近，最后一条擦过画面
3. **悬浮**：画像卡片悬浮在不同深度，镜头横移穿过，近处遮挡远处
4. **翻页**：书页从镜头前翻过（近景遮挡转场），露出装订好的小书
5. **拉远**：镜头退回夜色，年轮与品牌浮现

镜头路径在 `src/cinematic/camera.tsx`（`camPath`），每个场景的镜头关键帧在
`src/cinematic/CinematicScenes.tsx` 各自的 `camPath(...)` 里：`scale` 是推进、
`x/y` 是摇移、`roll` 是滚转。要加运动就改这几个数字。

## 目录结构

```
growth_ring_promo/
├── src/
│   ├── index.ts                入口：注册 Root
│   ├── Root.tsx                三个 Composition 都在这里注册
│   ├── theme.ts                配色 + 帧率 + sec() 秒转帧
│   ├── fonts.ts                字体加载（霞鹜文楷）
│   ├── anim.ts                 通用动画工具（第一款）
│   ├── config.tsx              第一款配置 Context（文案/配色/品牌注入）
│   ├── content.ts             ★ 第一款文案
│   ├── timeline.ts            ★ 第一款场景时间（秒）
│   ├── Video.tsx               第一款时间轴
│   ├── scenes/                 第一款七个场景组件
│   ├── components/             年轮母题、纸张颗粒、逐字打字
│   ├── KineticVideo.tsx        第二款时间轴
│   └── kinetic/                第二款专属
│       ├── content.ts         ★ 第二款文案
│       ├── timeline.ts        ★ 第二款场景时间（秒）
│       ├── effects.tsx        动效原语（Glitch/Decode/CountUp/荧光笔/幕布/红圈）
│       └── KineticScenes.tsx  第二款六个场景
│   ├── CinematicVideo.tsx      第三款时间轴
│   └── cinematic/              第三款专属
│       ├── content.ts         ★ 第三款文案
│       ├── timeline.ts        ★ 第三款镜头时间（秒）
│       ├── camera.tsx         镜头系统（Camera/视差层/飞行文字/前景/光斑）
│       └── CinematicScenes.tsx 第三款五个镜头
├── variants/                   ★ 第一款批量变体配置
│   ├── default.json           基底配置（完整）
│   ├── moss.json              示例：青苔绿配色版
│   └── privacy.json           示例：隐私卖点文案版
├── render-batch.mjs            ★ 第一款批量渲染脚本
├── colab_render.ipynb          ★ 第一款 Colab notebook
├── colab_render_kinetic.ipynb  ★ 第二款 Colab notebook
├── colab_render_cinematic.ipynb ★ 第三款 Colab notebook
├── public/fonts/               字体文件（随仓库同步）
└── out/                        渲染产物（已 gitignore）
```

## 一、本地：写代码 + 预览

环境要求：Node >= 18。

```bash
cd C:/dev/growth_ring_promo
npm install                 # 首次安装依赖
npm start                   # Remotion Studio：浏览器里实时预览、逐帧调试
npm run typecheck           # 类型检查
```

Studio 打开后左侧能切换 `GrowthRingPromo`、`GrowthRingKinetic` 和 `GrowthRingCinematic` 三个 composition。

### 调节奏 / 换帧率

所有时间都以**秒**定义，改一处即可：

- 第一款场景时长 → `src/timeline.ts`（48 秒）
- 第二款场景时长 → `src/kinetic/timeline.ts`（30 秒）
- 第三款镜头时长 → `src/cinematic/timeline.ts`（37 秒）
- 帧率（默认 24fps）→ `src/theme.ts` 的 `fps`，`sec()` 会自动换算所有动画时点
- 换文案 → 第一款 `src/content.ts`、第二款 `src/kinetic/content.ts`、第三款 `src/cinematic/content.ts`
- 换配色 → `src/theme.ts` 的 `theme` 对象

> **踩坑提醒**：场景时长缩短后，场景内部的动画时点不能超出新时长，
> 否则 `interpolate()` 会因区间非递增报错。改完务必全片低分辨率渲染扫一遍。

确认效果后推到 GitHub：

```bash
git add .
git commit -m "update promo video"
git push origin main
```

> Colab 拉的是远程仓库，**必须先 push**，否则渲染的还是旧代码。

## 二、批量产出视频（仅第一款）

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

### 第一款（冲突钩子版）

1. 打开 [Google Colab](https://colab.research.google.com/)，上传 `colab_render.ipynb`。
2. 确认已连接运行时。
3. 按顺序运行：① 环境+并发 → ② 拉代码 → ③ 依赖缓存到 Drive → ④ 全片低分辨率预览 →
   ⑤ 正式渲染 / ⑤b 批量渲染 → ⑥ 下载。
4. 改了代码后重新 push，再从 ② 重跑。

### 第二款（强动效版）

上传 `colab_render_kinetic.ipynb`，流程相同，但渲染目标是 `GrowthRingKinetic`，
且没有批量渲染步骤。文案在 `src/kinetic/content.ts`。

### 第三款（电影运镜版）

上传 `colab_render_cinematic.ipynb`，流程相同，渲染目标是 `GrowthRingCinematic`，
没有批量渲染步骤。文案在 `src/cinematic/content.ts`，镜头运动在 `src/cinematic/CinematicScenes.tsx`。

### 仓库地址

三个 notebook 的 ② 里 `REPO_URL` 都指向
`https://github.com/frank-2312/growth_ring_promo.git`。私有仓库需带 PAT：
`https://<用户名>:<PAT>@github.com/<仓库>.git`

### 常见坑

- **字体变方块**：`public/fonts/` 的 ttf 必须随仓库同步；改了忘 push 就会出现。
- **Chrome 下载失败**：首次渲染会下载 Chrome Headless Shell（约 150MB），受限网络下先跑
  `npx remotion browser ensure`。
- **缓存依赖版本不对**：改了 `package.json` 后把 notebook ③ 的 `USE_CACHE=False` 跑一次重建。
- **渲染太慢**：加 `--scale=0.75` 降分辨率，或把并发调小。
- **所有 @remotion/* 版本必须一致**：升级时不要只升一个包。

## 四、本地直接渲染

```bash
npm run render              # 第一款全片
npm run render:batch        # 第一款批量

# 第二款（手动指定 composition）
npx remotion render src/index.ts GrowthRingKinetic out/growth-ring-kinetic.mp4 --codec=h264
```
