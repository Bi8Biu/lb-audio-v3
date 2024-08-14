# lb-audio-v3

> 基于 Vue3 + TS 的 音乐播放器小组件
> 拥有 播放/暂停、上/下一首、音量调节、播放顺序调节、歌词显示功能<br/>
> PS：有好的建议 和 BUG 可以向仓库提 issues

![img](https://i.bmp.ovh/imgs/2022/06/21/fdad5c9c46149e58.png)

## 安装

### 使用 npm 安装

```shell
npm install lb-audio-v3 
```

### 使用 yarn  安装

```shell
yarn add lb-audio-v3 
```

### 使用之前

您应该在一定程度上了解 vue3 的相关概念、基础知识，这样在使用本组件的时候会更顺利

### 全局注册

在项目的 `入口文件（一般是 main.ts）` 中配置

```ts
import { createApp } from 'vue'
import App from './App.vue'

// 引入组件
import lbAudio from 'lb-audio-v3';

// 引入组件样式
import 'lb-audio-v3/style'

const app = createApp(App);

// 全局注册组件
app.use(lbAudio);                // 注册组件需要在 mount(挂载) 之前哦

app.mount('#app')
```

### 局部注册

在要使用的 `.vue` 文件中配置

```vue
<template>
 <lbAudio></lbAudio>
</template>
<script setup lang='ts'>
// 引入组件
import lbAudio from 'lb-audio-v3'; 
// 引入组件样式
import 'lb-audio-v3/style'
</script>
```

## props

| **参数**  |         **说明**         |     **类型**     |                         **可选值**                          | **是否必须** | **默认值** |
| :-------: | :----------------------: | :--------------: | :---------------------------------------------------------: | :----------: | :--------: |
| musicList |         歌曲列表         |`musicListType` |                              —                              |      是      |     —      |
|   index   |       默认播放索引       |      `Number`      |                  0  ~ musicList.length - 1                  |      否      |     0      |
|  volume   |       默认音量大小       |      `Number`      |                           0 ~ 100                           |      否      |     50     |
|  lyrics   |     歌词是否默认开启     |     `Boolean`      |                         true、false                         |      否      |   false    |
| playOrder |     歌曲默认播放顺序     |      `playOrderType`      | 'along' (顺序播放)、 'random' (随机播放)、'loop' (单曲循环) |      否      |  'along'   |
| playList  | 显示播放列表默认是否展开 |     `Boolean`      |                         true、false                         |      否      |   false    |

类型说明如下：

```ts
type musicItem =  {
    name: string,  // 歌曲名称
    author: string,  // 歌手名
    url: string,  // 歌曲文件地址
    img: string,  // 歌曲封面图
    lrc: string   // lrc歌词字符串
};
type musicListType = musicItem[];

// 播放顺序：'along' (顺序播放)、 'random' (随机播放)、'loop' (单曲循环)
type playOrderType = 'along' | 'random' | 'loop';

// 导入类型
import type {musicListType, musicItemType playOrderType } from 'lb-audio-v3';
```

## Events

| 事件名称 | 说明         | 回调参数             |
| -------- | ------------ | -------------------- |
| error    | 音频加载失败 | 加载失败的 musicItem |

## 示例

```vue
<template>
 <lbAudio :musicList="musicList" :index="8" :lyrics="true" :playOrder="playOrder"></lbAudio>
</template>

<script setup lang="ts">
// 引入组件
import lbAudio, {type musicListType, type playOrderType  } from 'lb-audio-v3';
// 引入组件样式
import 'lb-audio-v3/style'
// 播放顺序
const playOrder = ref<playOrder>('along');
// 播放列表
const musicList = ref<musicListType>([
 {
  name: '第三人称',
  author: '买辣条也用券',
  url: 'https://music.163.com/song/media/outer/url?id=502043537.mp3',
  img: 'http://myblog.fgimaxl2.vipnps.vip/getUpload/94v3QwVp3HI7LAW3VXC-TD_P.jpg',
  lrc: `[00:08.670]原唱：Hush\n[00:11.670]他想知道那是谁\n[00:18.770]为何总沉默寡言\n[00:25.520]人群中也算抢眼\n[00:32.670]抢眼的孤独难免\n[00:40.240]快乐当然有一点\n[00:47.050]不过寂寞更强烈\n[00:53.840]难过时候不流泪\n[01:01.069]流泪也不算伤悲\n[01:09.269]天真以为是他的独特品味\n[01:14.867]殊不知是他\n[01:17.968]难以言喻的对决\n[01:23.947]子母画面分割上演谍对谍\n[01:29.718]而谁是谁\n[01:38.400]对于第三人称的角度而言\n[01:43.968]也明白其实\n[01:46.888]每个人都有缺陷\n[01:52.870]不自觉遮掩 多少也算\n[01:58.989]自然的行为\n[02:20.619]\n[02:34.739]快乐当然有一点\n[02:42.028]不过寂寞更强烈\n[02:49.139]难过时候不流泪\n[02:56.110]流泪也不算伤悲\n[03:04.149]天真以为是他的独特品味\n[03:09.929]殊不知是他\n[03:12.679]难以言喻的对决\n[03:18.669]子母画面分割上演谍对谍\n[03:24.989]而谁是谁\n[03:32.399]对于第三人称的角度而言\n[03:38.718]也明白其实\n[03:41.360]每个人都有缺陷\n[03:46.568]才不断的追寻 更好的自己\n[03:53.818]直到青春一定程度的浪费\n[03:59.889]才觉得可贵\n[04:07.859]他想知道那是谁\n[04:27.858]OP: 海边的卡夫卡有限公司 (Admin By EMI MPT）\n[04:28.858]SP:百代音乐代理（北京）有限公司\n`
 },
 {
  name: '午夜心碎俱乐部2.0',
  author: '大D(DLyn)',
  url: 'https://music.163.com/song/media/outer/url?id=565794655.mp3',
  img: 'https://p2.music.126.net/NSg1X6Qpc-oi5WAMg3U3ag==/109951163311151254.jpg',
  lrc: `[00:02.41]（以上作词作曲是指中文段落部分,而HOOK中find并不是错词,而是故意改编的）[00:02.58]编曲&原词曲：Sapientdream - walls[00:03.05]Walls Remix\n[00:03.14]\n[00:03.71]If we fight\n[00:05.59]that the walls we built so high are falling so low\n[00:11.65]falling so low\n[00:14.78]If we fight\n[00:17.94]that the walls we built so high are falling so low\n[00:24.01]Oh oh\n[00:27.02]If we fight\n[00:30.17]that the walls we built so high are falling so low\n[00:36.24]falling so low\n[00:39.31]If we fight\n[00:42.40]that the walls we built so high are falling so low\n[00:48.62]Oh oh\n[00:50.97]\n[00:53.51]If we fight\n[00:53.90]If you gone\n[00:54.89]到了午夜俱乐部的分岔路口\n[00:57.90]继续偷偷\n[00:59.15]我继续偷偷心碎\n[01:00.69]我躲进了被窝\n[01:02.09]悄悄露出头和手\n[01:04.04]期待着Phone call\n[01:05.28]哎 I wanna you你总不wanna me\n[01:07.14]唉 哎 can you feeling the remix\n[01:10.18]外面良辰美景但是除了你我都没兴趣\n[01:13.57]满电的手机照亮头顶灰白的墙壁\n[01:16.80]我也不知道为谁难过\n[01:20.32]我也不知道为谁难过\n[01:29.90]If we fight\n[01:30.58]If you gone\n[01:33.20]\n[01:40.94]If we fight\n[01:44.04]that the walls we built so high are falling so low\n[01:50.07]falling so low\n[01:53.67]If we fight\n[01:56.29]that the walls we built so high are falling so low\n[02:02.44]Oh oh\n[02:05.55]If we fight\n[02:08.69]that the walls we built so high are falling so low\n[02:14.74]falling so low\n[02:17.81]If we fight\n[02:20.92]that the walls we built so high are falling so low\n[02:27.08]Oh oh\n[02:31.01]\n[02:31.71]*PopDan Roll This ****!!*\n[02:32.21]\n`
 },
 {
  name: '水星记',
  author: '郭顶',
  url: 'https://music.163.com/song/media/outer/url?id=441491828.mp3',
  img: 'https://p2.music.126.net/wSMfGvFzOAYRU_yVIfquAA==/2946691248081599.jpg',
  lrc: `[00:19.200]着迷于你眼睛\n[00:21.510]\n[00:22.910]银河有迹可循\n[00:25.040]\n[00:26.160]穿过时间的缝隙\n[00:28.980]\n[00:29.740]它依然真实地\n[00:32.750]\n[00:33.460]吸引我轨迹\n[00:36.230]\n[00:40.440]这瞬眼的光景\n[00:42.950]\n[00:43.970]最亲密的距离\n[00:46.550]\n[00:47.470]沿着你皮肤纹理 \n[00:51.380]走过曲折手臂\n[00:54.040]\n[00:54.960]做个梦给你\n[00:57.230]\n[00:58.580]做个梦给你\n[01:01.249]\n[01:03.668]等到看你银色满际\n[01:06.260]\n[01:07.069]等到分不清季节更替\n[01:11.590]\n[01:12.938]才敢说沉溺\n[01:16.078]\n[01:19.980]还要多远才能进入你的心\n[01:26.200]\n[01:27.170]还要多久才能和你接近\n[01:33.310]\n[01:34.328]咫尺远近却\n[01:36.780]无法靠近的那个人\n[01:42.000]也等着和你相遇\n[01:47.610]\n[01:49.030]环游的行星\n[01:51.750]\n[01:52.269]怎么可以\n[01:55.170]\n[01:56.129]拥有你\n[01:57.989]\n[02:13.728]这瞬眼的光景\n[02:16.269]\n[02:17.119]最亲密的距离\n[02:19.679]\n[02:20.628]沿着你皮肤纹理\n[02:24.310]走过曲折手臂\n[02:27.359]\n[02:28.060]做个梦给你\n[02:30.478]\n[02:31.579]做个梦给你\n[02:34.619]\n[02:36.589]等到看你银色满际\n[02:40.288]等到分不清季节更替\n[02:44.660]\n[02:45.869]才敢说沉溺\n[02:53.138]还要多远才能进入你的心\n[02:59.399]\n[03:00.329]还要多久才能和你接近\n[03:06.478]\n[03:07.429]咫尺远近却\n[03:09.560]无法靠近的那个人\n[03:15.128]也等着和你相遇\n[03:20.638]\n[03:21.829]环游的行星\n[03:24.739]\n[03:25.388]怎么可以\n[03:29.079]拥有你\n[03:35.530]\n[04:05.218]还要多远才能进入你的心\n[04:10.869]\n[04:11.929]还要多久才能和你接近\n[04:18.028]\n[04:19.050]咫尺远近却无法靠近的那个人\n[04:26.687]要怎么探寻\n[04:30.319]要多么幸运\n[04:33.538]才敢让你发觉你并不孤寂\n[04:39.778]\n[04:40.509]当我还可以再跟你飞行\n[04:46.579]\n[04:47.690]环游是无趣\n[04:50.569]\n[04:51.339]至少可以\n[04:54.639]\n[04:55.240]陪着你`
 },
]);
</script>

```

## 工具方法

### convertASSToLRC

> 用于将 ASS 格式歌词 转为 LRC 格式歌词

```ts
import { convertASSToLRC } from 'lb-audio-v3';

const ass = `[Script Info]
; Script generated by Aegisub
Title: Ye Qu
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0
Timer: 100.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,1.5,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:12.00,0:00:16.00,Default,,0,0,0,,一群嗜血的蚂蚁 被腐肉所吸引
Dialogue: 0,0:00:17.00,0:00:21.00,Default,,0,0,0,,我面无表情 看孤独的风景
Dialogue: 0,0:00:22.00,0:00:26.00,Default,,0,0,0,,失去你 爱恨开始分明
Dialogue: 0,0:00:27.00,0:00:31.00,Default,,0,0,0,,失去你 还有什么事好关心
Dialogue: 0,0:00:32.00,0:00:36.00,Default,,0,0,0,,当鸽子不再象征和平
Dialogue: 0,0:00:37.00,0:00:41.00,Default,,0,0,0,,我终于被提醒 广场上喂食的是秃鹰
Dialogue: 0,0:00:42.00,0:00:46.00,Default,,0,0,0,,我用漂亮的押韵 形容被掠夺一空的爱情
Dialogue: 0,0:00:47.00,0:00:51.00,Default,,0,0,0,,啊 乌云开始遮蔽 夜色不干净
Dialogue: 0,0:00:52.00,0:00:56.00,Default,,0,0,0,,公园里葬礼的回音 在漫天飞行
Dialogue: 0,0:00:57.00,0:01:01.00,Default,,0,0,0,,送你的白色玫瑰 在纯黑的环境凋零
Dialogue: 0,0:01:02.00,0:01:06.00,Default,,0,0,0,,乌鸦在树枝上诡异的很安静
Dialogue: 0,0:01:07.00,0:01:11.00,Default,,0,0,0,,静静听 我黑色的大衣
Dialogue: 0,0:01:12.00,0:01:16.00,Default,,0,0,0,,想温暖你 日渐冰冷的回忆
Dialogue: 0,0:01:17.00,0:01:21.00,Default,,0,0,0,,走过的走过的生命
Dialogue: 0,0:01:22.00,0:01:26.00,Default,,0,0,0,,啊 四周弥漫雾气`;

console.log(convertASSToLRC(ass));
/* 
    [0:12.00]一群嗜血的蚂蚁 被腐肉所吸引
    [0:17.00]我面无表情 看孤独的风景
    [0:22.00]失去你 爱恨开始分明
    [0:27.00]失去你 还有什么事好关心
    [0:32.00]当鸽子不再象征和平
    [0:37.00]我终于被提醒 广场上喂食的是秃鹰
    [0:42.00]我用漂亮的押韵 形容被掠夺一空的爱情
    [0:47.00]啊 乌云开始遮蔽 夜色不干净
    [0:52.00]公园里葬礼的回音 在漫天飞行
    [0:57.00]送你的白色玫瑰 在纯黑的环境凋零
    [1:02.00]乌鸦在树枝上诡异的很安静
    [1:07.00]静静听 我黑色的大衣
    [1:12.00]想温暖你 日渐冰冷的回忆
    [1:17.00]走过的走过的生命
    [1:22.00]啊 四周弥漫雾气
*/
```
