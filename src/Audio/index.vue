<!--
 * @Explain: xxx
 * @Author: SuperLy
 * @LastEditors: KuAi9
 * @Date: 2022-05-30 12:28:50
 * @LastEditTime: 2022-07-29 12:36:16
 * @FilePath: \lb-audio-v3\src\Audio\index.vue
-->
<template>
    <div class="audio-container">
        <audio autoplay ref="audio" :src="musicList[playState.index].url" @play="playState.play = true;"></audio>
        <!-- 封面 -->
        <div class="cover">
            <div class="play-bar" @click="audioPlay" :title="musicList[playState.index].name">
                <img src="@/assets/img/play-bar-middle.png">
                <img :class="playState.play ? 'play' : 'stop'" src="@/assets/img/play-bar.png">
            </div>
            <img class="cover-img" :src="musicList[playState.index].img" :alt="musicList[playState.index].name" :style="{
                transform: `rotate(-${playState.angle}deg)`
            }">
        </div>
        <!-- 播放器主体 -->
        <div class="audio-main" @mousemove.prevent="volumeClickMove($event)" @mouseup="volumeMoveFlag = false"
            @mouseleave.stop="volumeMoveFlag = false">
            <!-- 歌曲名 -->
            <p class="title text-ellipsis">{{ musicList[playState.index].name + ' - ' +
                    musicList[playState.index].author
            }} </p>
            <!-- 控制器 -->
            <div class="control">

                <!-- 上一首 -->
                <i class="iconfont icon-shangyishou" @click="previous"></i>

                <!-- 播放 / 暂停 -->
                <i :class="['iconfont', 'play', playState.play ? 'icon-zanting' : 'icon-bofang']"
                    @click="audioPlay"></i>

                <!-- 下一首 -->
                <i class="iconfont icon-xiayishou" @click="next"></i>

                <!-- 音量设置 -->
                <div class="volume-box">
                    <div ref="volumeProgressBarDom" class="volume-progress"
                        :style="{ display: volumeMoveFlag ? 'block' : '' }" @mousedown="volumeClickDown($event)">
                        <div :style="{ height: playState.volume + '%' }"></div>
                    </div>
                    <i :class="[
                        'iconfont', 'volume',
                        playState.volume === 0 ? 'icon-jingyin' : (playState.volume >= 60 ? 'icon-gaoyinliang' : 'icon-diyinliang')
                    ]" @click="volumeMute"></i>
                </div>

                <i :class="['iconfont', 'play-order', playState.playOrder === 'along' ? 'icon-xunhuanbofang' : (playState.playOrder === 'random' ? 'icon-suijibofang' : 'icon-danquxunhuan')]"
                    @click="changePlayOrder"></i>

                <!-- 歌词开关 -->
                <i :class="['iconfont', 'lyrics', playState.lyrics ? 'icon-gecikai' : 'icon-geciguan']"
                    @click="playState.lyrics = !playState.lyrics"></i>
                <!-- 歌单列表 -->
                <i class="iconfont icon-liebiao" @click="playState.playList = !playState.playList"></i>
            </div>
            <!-- 歌曲进度条 -->
            <div ref="ProgressDom" progress="true"
                :class="['audio-progress', ProgressDomLock ? 'wait' : 'pointer', (playState.buffer || ProgressMoveFlag) ? 'audio-progress-hover' : '']"
                @mousedown="() => { if (playState.getDuration) ProgressMoveFlag = true }">
                <!-- 缓冲 -->
                <div v-for=" cache of playState.bufferList" progress="true" class="cache" :style="{
                    width: (cache.end - cache.start) / playState.duration * 100 + '%',
                    left: cache.start / playState.duration * 100 + '%'
                }"></div>
                <!-- 已经播放 -->
                <div class="elaps" progress="true" :style="{ width: playState.progress * 100 + '%' }">
                    <div class="thumb" progress="true">
                        <i progress="true" v-show="playState.buffer" class="iconfont icon-buffer"></i>
                    </div>
                </div>
            </div>
        </div>
        <!-- 歌词容器 -->
        <div v-if="playState.lyrics" class="lrc-container">
            <!-- <p v-for="lrc, i of playState.lrcList"
				:class="['lrc-item', 'text-ellipsis', playState.curLrcIndex === i ? 'lrc-current' : '']">
				{{ lrc.txt }}</p> -->
            <p>{{ frontLrc }}</p>
            <p class="text-ellipsis lrc-current">{{ curLrc }}</p>
            <p>{{ nextLrc }}</p>
        </div>
        <!-- 播放列表 -->
        <div ref="musicListDom" :class="['music-list', playState.playList ? 'show-list' : '']">
            <div v-for="music, i of musicList" :class="[playState.index === i ? 'cur' : '']"
                @click="playState.index = i">
                <span class="music-idx">{{ i + 1 }}</span>
                <span class="music-name">{{ music.name }}</span>
                <span>{{ music.author }}</span>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import getOffset from '@/assets/ts/getOffset';
import parseLrc from '@/assets/ts/parseLrc';
import { reactive, watch, ref, Ref, nextTick, onBeforeUnmount } from 'vue';

type musicItem = {
    name: string,
    author: string,
    url: string,
    img: string,
    lrc: string
};

// props
const { musicList, index, volume, lyrics, playOrder, playList } = defineProps({
    // 歌曲列表
    musicList: {
        type: Array as () => Array<musicItem>,
        required: true,
    },
    // 默认播放索引
    index: {
        type: Number,
        default: 0
    },
    // 默认音量
    volume: {
        type: Number,
        default: 50
    },
    // 歌词是否默认开启
    lyrics: {
        type: Boolean,
        default: false
    },
    // 歌曲默认播放顺序
    playOrder: {
        type: String as () => 'along' | 'random' | 'loop',
        default: 'along'
    },
    // 是否默认显示播放列表
    playList: {
        type: Boolean,
        default: false
    }
});

// 自定义事件
const emit = defineEmits(['error'])


// audio 对象
const audio = ref() as Ref<HTMLAudioElement>;

// audio 监听
nextTick(() => {
    // 开始加载歌曲
    audio.value.addEventListener('loadstart', () => {
        // 关闭歌曲时长信息获取完毕标识
        playState.getDuration = false;
        // 开启进度条加载状态
        playState.buffer = true;
    })
    // 歌曲总时长变化（获取到歌曲时长信息时）
    audio.value.addEventListener('durationchange', () => {
        // 开启歌曲时长信息获取完毕标识
        playState.getDuration = true;
        // 更新歌曲时长状态
        playState.duration = audio.value.duration;
        // 开启进度条点击
        ProgressDomLock.value = false;
    })
    // 缓冲足以播放
    audio.value.addEventListener('canplaythrough', () => {
        // 取消进度条加载状态
        playState.buffer = false;
    })
    // 因为缓冲被暂停
    audio.value.addEventListener('waiting', () => {
        // 开启进度条加载状态
        playState.buffer = true;
    })
    // 	播放进度改变
    audio.value.addEventListener('timeupdate', () => {
        // 拖动进度条中，暂不随着播放更新进度条（互斥）
        if (ProgressMoveFlag.value) return;
        // 更新播放进度状态
        playState.progress = audio.value.currentTime / playState.duration;
        // 获取缓冲对象
        const timeRanges = audio.value.buffered;
        const bufferList = [];
        for (let i = 0; i < timeRanges.length; i++) {
            let obj = {
                start: timeRanges.start(i),
                end: timeRanges.end(i)
            }
            bufferList.push(obj);
        }
        // 更新缓存对象状态
        playState.bufferList = bufferList;
        // 如果开启歌词
        if (playState.lyrics) {
            // 更新选中歌词
            // 找出第一个 timeline 大于当前播放时间的歌词，那么上一句歌词就是被播放的词
            let index = playState.lrcList.findIndex((lrc) => lrc.lineTime > audio.value.currentTime) - 1;
            // 最后一句：找不到 timeline 更大的了，返回 -1， -1 - 1 = -2
            index = index === -2 ? playState.lrcList.length - 1 : index;
            //  第一句： 0 - 1 = -1
            index = index === -1 ? 0 : index;
            // 更新状态 
            playState.curLrcIndex = index;
        }
    })

    // 播放完毕
    audio.value.addEventListener('ended', () => {
        // 播放下一首
        next();
    });

    // 加载失败
    audio.value.addEventListener('error', () => {
        // 触发加载错误事件
        emit('error', musicList[playState.index])
        // 下一首
        next();
    })
})

// 播放状态类型
type playStateType = {
    // 当前播放歌曲位于播放列表的索引值
    index: number,
    // 播放 / 暂停
    play: boolean,
    // 歌曲时长
    duration: number,
    // 是否获取到时长
    getDuration: boolean,
    // 播放进度百分比 ( 0 - 1 )
    progress: number,
    // 音量
    volume: number,
    // 是否需要缓冲
    buffer: boolean,
    // 缓冲列表
    bufferList: Array<{ start: number, end: number }>,
    // 歌词开 / 歌词关
    lyrics: boolean,
    // 歌词列表
    lrcList: Array<{
        // 时间,单位：秒
        lineTime: number,
        // 歌词
        txt: string
    }>,
    // 当前播放歌词索引
    curLrcIndex: number,
    // 播放顺序
    playOrder: 'along' | 'random' | 'loop',
    // 唱片旋转定时器
    coverTimer: number | undefined,
    // 唱片旋转角度
    angle: number,
    // 是否显示播放列表
    playList: boolean
}

// 播放状态
const playState: playStateType = reactive({
    index,
    play: false,
    volume,
    duration: 0,
    getDuration: false,
    progress: 0,
    buffer: true,
    bufferList: [],
    lyrics,
    lrcList: parseLrc(musicList[index].lrc),
    curLrcIndex: 0,
    playOrder,
    coverTimer: undefined,
    angle: 0,
    playList,
});

// 监听播放状态变化
watch(() => playState.play, (newVal) => {
    if (playState.coverTimer) {
        clearInterval(playState.coverTimer);
        playState.coverTimer = undefined;
    }
    if (newVal) {
        playState.coverTimer = window.setInterval(() => {
            // 每帧旋转角度
            // 每帧旋转角度
            playState.angle += 0.3;
            if (playState.angle >= 360) playState.angle = 0;
        }, 16)
    }
});

// 监听歌曲播放顺序状态变化
watch(() => playState.playOrder, (newVal) => {
    // 如果 playState.playOrder 变为 单曲循环
    if (newVal === "loop") audio.value.loop = true;
});


// 播放 / 暂停
const audioPlay = () => {
    if (playState.play) audio.value.pause();
    else audio.value.play();
    playState.play = !playState.play;
}

// 上一首
const previous = () => {
    if (playState.playOrder === 'random') {
        randomIndex.value--;
        if (randomIndex.value < 0) {
            randomIndex.value = musicList.length - 1;
        }
        playState.index = randomIndexList[randomIndex.value];
    } else {
        playState.index--;
    }
    audio.value.load();
}
// 下一首
const next = () => {
    if (playState.playOrder === 'random') {
        randomIndex.value++;
        if (randomIndex.value >= musicList.length) {
            randomIndex.value = 0;
        }
        playState.index = randomIndexList[randomIndex.value];
    } else {
        playState.index++;
    }
    audio.value.load();
}
watch(() => playState.index, (newVal) => {
    if (newVal < 0) {
        playState.index = musicList.length - 1;
    } else if (newVal >= musicList.length) {
        playState.index = 0;
    }
})

// 播放顺序 和 播放列表 功能

// 随机索引数组,用于随机播放时的索引
const randomIndexList = [...new Array(musicList.length).keys()];
randomIndexList.sort(() => {
    return Math.random() - 0.5
});

// 当前索引：默认为 随机索引数组元素 0 的索引
let randomIndex = ref(randomIndexList.findIndex(item => item === 0));

// 切换播放顺序
const changePlayOrder = () => {
    if (playState.playOrder === 'along') playState.playOrder = 'random';
    else if (playState.playOrder === 'random') playState.playOrder = 'loop';
    else if (playState.playOrder === 'loop') playState.playOrder = 'along';
};
// 播放列表容器 
const musicListDom = ref() as Ref<HTMLElement>;
// 监听 播放索引变化，即及时更新 randomIndex
watch(() => playState.index, (newVal) => {
    // 如果当前不是随机播放顺序，则需要手动更新 randomIndex
    if (playState.playOrder !== 'random') randomIndex.value = randomIndexList.findIndex(item => item === newVal);
    // 索引变化了，如果歌曲列表开启着，则滚动到当前播放的歌曲
    musicListScroll(newVal);
});
// 监听播放列表开启状态 
watch(() => playState.playList, (newVal) => {
    // 开启播放列表，滚动到当前播放的歌曲
    if (newVal) musicListScroll(playState.index)

});
const musicListScroll = (index: number) => {
    if (playState.playList) {
        const height = musicListDom.value.querySelector('div')?.offsetHeight;
        if (height) musicListDom.value.scrollTop = index * height;
    }
}

// 音量控制功能
// #region
// 监听音量变化，更新到 audio
watch(() => playState.volume, (newVal) => {
    audio.value.volume = newVal / 100;
});

// 备份音量，用于取消静音时切换到原来的音量大小
let lastVolume = playState.volume;

// 静音
const volumeMute = () => {
    if (playState.volume != 0) {
        playState.volume = 0;
    } else {
        playState.volume = lastVolume;
    }
}

// 拖动音量条   
// 音量可拖动标志，鼠标按下，将 volumeMoveFlag 设为 true, 鼠标弹起时
let volumeMoveFlag = ref(false);

// 进度条元素
const volumeProgressBarDom = ref();

// 鼠标移动，设置音量条
const volumeClickMove = (event: MouseEvent) => {
    if (volumeMoveFlag.value) {
        // 总进度条 Y 坐标
        const progressBarOffsetTop = getOffset(volumeProgressBarDom.value).Y;
        // 总进度条 高度
        const progressBarHeight = volumeProgressBarDom.value.offsetHeight;
        // 进度 = (总进度条Y坐标 + 总进度条高度 - 点击的 Y坐标) / 总进度条高度 ，乘以 100 转换为 百分比
        let abr = (progressBarHeight + progressBarOffsetTop - event.y) / progressBarHeight * 100
        abr = abr < 0 ? 0 : abr;
        abr = abr > 100 ? 100 : abr;
        playState.volume = abr;
        // 更新备份
        lastVolume = playState.volume;
    }
}

// 点击设置音量条（鼠标落下）
const volumeClickDown = (event: MouseEvent) => {

    // 总进度条 Y 坐标
    const progressBarOffsetTop = getOffset(volumeProgressBarDom.value).Y;

    // 总进度条 高度
    const progressBarHeight = volumeProgressBarDom.value.offsetHeight;

    // 进度 = (总进度条Y坐标 + 总进度条高度 - 点击的 Y坐标) / 总进度条高度 ，乘以 100 转换为 百分比
    playState.volume = (progressBarHeight + progressBarOffsetTop - event.y) / progressBarHeight * 100;
    // 更新备份
    lastVolume = playState.volume;
    // 禁止拖动
    volumeMoveFlag.value = true;
}
// #endregion



//  改变歌曲进度功能
// #region
// 在得到歌曲信息前，不允许改变进度条
let ProgressDomLock = ref(true);
// 监听播放歌曲变化
watch(() => playState.index, () => {
    // 换歌，开启进度条锁
    ProgressDomLock.value = true;
});

// 鼠标按下前不允许拖动进度条
let ProgressMoveFlag = ref(false);

// 进度条元素
const ProgressDom = ref();
// 点击进度条改变进度 (弹起)
const changeProgress = (event: MouseEvent) => {
    // 未获取到歌曲信息，不进行操作
    if (ProgressDomLock.value) return;
    // 如果滑动开启 或 在 进度条上弹起 则可以更新进度条
    if (ProgressMoveFlag.value || (event.target as HTMLElement).getAttribute('progress')) {
        // 总进度条 X 坐标
        const progressOffsetLeft = getOffset(ProgressDom.value).X;
        // 总进度条 宽度
        const progressWidth = ProgressDom.value.offsetWidth;

        // 进度 = (点击的 X 坐标 - 总进度条 X 坐标) / 总进度条宽度 ，乘以 100 转换为 百分比
        playState.progress = (event.x - progressOffsetLeft) / progressWidth;
        // 更新 audio 播放位置
        audio.value.currentTime = playState.progress * playState.duration;
        // 关闭滑动操作
        ProgressMoveFlag.value = false;
    }
}
// 移动 Thumb 改动进度条
const moveThumb = (event: MouseEvent) => {
    if (ProgressMoveFlag.value) {
        // 阻止默认行为
        event.preventDefault();
        // 总进度条 X 坐标
        const progressOffsetLeft = getOffset(ProgressDom.value).X;
        // 总进度条 宽度
        const progressWidth = ProgressDom.value.offsetWidth;
        // 进度
        let progress = event.x - progressOffsetLeft;
        // 设置最小值与最大值
        progress = progress < 0 ? 0 : (progress > progressWidth ? progressWidth : progress);
        // 更新进度状态
        playState.progress = progress / progressWidth;
    }

};

// 将 mousemove 和 mouseUp 事件添加给 body
window.document.body.addEventListener('mousemove', moveThumb);
window.document.body.addEventListener('mouseup', changeProgress);

// 组件销毁时注销事件
onBeforeUnmount(() => {
    window.document.body.removeEventListener('mousemove', moveThumb);
    window.document.body.removeEventListener('mousemove', changeProgress);

})
// #endregion


// 歌词实现
// 监听换歌，换歌则更新歌词
watch(() => playState.index, (newVal) => {
    playState.lrcList = parseLrc(musicList[newVal].lrc);
    // 重置歌词索引
    playState.curLrcIndex = 0;
    // 更新歌词
    changeLrc();
    // 重置唱片旋转
    playState.angle = 0;
});
// 监听 当前歌词索引变化
watch(() => playState.curLrcIndex, () => {
    if (playState.lyrics) {
        // lrcScrollTop();
        changeLrc();
    }
});
// 监听 歌词开启
watch(() => playState.lyrics, (newVal) => {
    // 如果开启，定位当前歌词
    if (newVal) {
        nextTick(() => {
            // lrcScrollTop();
            changeLrc();
        })
    }
});


// 响应式歌词变量方式
const frontLrc = ref('');
const curLrc = ref(playState.lrcList[0].txt);
const nextLrc = ref(playState.lrcList[1].txt);
// 改变歌词
const changeLrc = () => {
    // 第一句
    if (playState.curLrcIndex === 0) {
        frontLrc.value = '';
        curLrc.value = playState.lrcList[playState.curLrcIndex].txt;
        nextLrc.value = playState.lrcList[playState.curLrcIndex + 1].txt;
    } else if (playState.curLrcIndex === playState.lrcList.length - 1) {
        // 最后一句
        frontLrc.value = playState.lrcList[playState.curLrcIndex - 1].txt;
        curLrc.value = playState.lrcList[playState.curLrcIndex].txt;
        nextLrc.value = '';
    } else {
        frontLrc.value = playState.lrcList[playState.curLrcIndex - 1].txt;
        curLrc.value = playState.lrcList[playState.curLrcIndex].txt;
        nextLrc.value = playState.lrcList[playState.curLrcIndex + 1].txt;
    }
}

// 歌词滚动方式（有 bug：部分屏幕下 scrollTop 不精确）
// const lrcScrollTop = () => {
// 	// 滚动歌词容器
// 	const lrcContainer = window.document.querySelector('.lrc-container') as HTMLElement;
// 	// 每行歌词高度
// 	const lrcItemHeight = (window.document.querySelector(':not(.lrc-current).lrc-item') as HTMLElement).offsetHeight;
// 	// 需要滚动的高度 = 当前索引 * 每行歌词高度
// 	// 前两行不需要滚动，进行特殊处理
// 	let index = playState.curLrcIndex - 1;
// 	lrcContainer.scrollTop = index * lrcItemHeight;
// 	console.log(index + '----------' + lrcContainer.scrollTop + '----------' + lrcItemHeight);
// }
</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'lb-audio-v3'
})	
</script>

<style lang="scss" scoped>
@import url('//at.alicdn.com/t/font_3402576_1b8z9je7n4u.css');

.audio-container {
    position: relative;
    display: flex;
    width: 320px;
    height: 64px;
    background-color: #F9F9F9;

    .text-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &,
    &>* {
        box-sizing: border-box;
    }

    .cover {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 64px;
        height: 64px;
        margin-right: 20px;
        overflow: hidden;

        .play-bar {
            position: absolute;
            width: 100%;
            height: 100%;
            cursor: pointer;
            z-index: 2;

            img:nth-of-type(1) {
                position: absolute;
                top: -1px;
                left: 50%;
                transform: translateX(-50%);
                width: 5px;
                z-index: 2;
            }

            img:nth-of-type(2) {
                position: absolute;
                top: 2.5px;
                left: calc(50% - 1px);
                height: 40%;
                transform-origin: 0 0;
                transition: all 0.5s;
                transform: rotate(-10deg);

                &.stop {
                    transform: rotate(-55deg);
                }
            }
        }

        img.cover-img {
            height: 75%;
            border-radius: 50%;
        }
    }

    .audio-main {
        flex: 1;
        margin-right: 5px;
        padding: 0 5px;
        color: #777;
        overflow: hidden;

        .title {
            font-size: 16px;
            width: 100%;
            padding: 8px 0 5px 0;
            font-weight: 700;
            margin: 0;
        }

        .control {
            height: 20px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;

            i {
                line-height: 20px;
                cursor: pointer;
                font-weight: 300;

                &:hover {
                    color: #555;
                    font-weight: 500;
                }

                &.play {
                    font-size: 18px;
                }

                &.volume {
                    font-size: 20px;
                }

                &.play-order {
                    font-weight: 700;
                }

                &.lyrics {
                    font-size: 24px;
                    font-weight: 500;
                }


            }

            .volume-box {
                display: flex;
                position: relative;

                &:hover {
                    .volume-progress {
                        display: block
                    }
                }

                .volume-progress {
                    display: none;
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    border-radius: 4px;
                    height: 30px;
                    background-color: #AAAAAA;
                    overflow: hidden;
                    cursor: pointer;

                    div {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        background-color: #8EA9A7;
                    }
                }

            }
        }

        .audio-progress {
            position: relative;
            height: 5px;
            background-color: #E5E5E5;
            border-radius: 5px;

            &.pointer {
                cursor: pointer;
            }

            &.wait {
                cursor: wait;
            }

            &.audio-progress-hover,
            &:hover {
                .thumb {
                    width: 8px !important;
                    height: 8px !important;
                }

            }

            .elaps {
                display: flex;
                align-items: center;
                position: relative;
                border-radius: 5px;
                height: 100%;
                background-color: #8EA9A7;
                min-width: 4px;

                .thumb {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    right: 0;
                    width: 0px;
                    height: 0px;
                    border-radius: 50%;
                    background-color: #8EA9A7;
                    transition: all 0.3s;
                    overflow: hidden;

                    i {
                        display: block;
                        font-size: 12px;
                        transform: scale(0.5);
                        color: rgba(#fff, 0.8);
                        animation: rotat 1s linear infinite;
                    }

                    @keyframes rotat {
                        0% {
                            transform: scale(0.5) rotate(360deg);
                        }

                        100% {
                            transform: scale(0.5) rotate(0deg);
                        }
                    }
                }
            }

            .cache {
                position: absolute;
                width: 0;
                border-radius: 5px;
                height: 100%;
                background-color: #AAAAAA;
            }
        }
    }

    .lrc-container {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        width: 300px;
        height: 80px;
        color: #000;
        font-weight: 500;
        overflow: hidden;

        p {
            text-align: center;
            font-size: 16px;
            line-height: 25px;
            height: 25px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0;

            &.lrc-current {
                font-size: 20px;
                line-height: 30px;
                height: 30px;
                font-weight: 700;
            }
        }
    }

    .music-list {
        position: absolute;
        top: 100%;
        width: 100%;
        max-height: 0px;
        background-color: #f9f9f9;
        transition: max-height 0.2s linear;
        box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;
        overflow-y: scroll;
        /* 设置滚动调样式 */

        &::-webkit-scrollbar {
            width: 4px;
            background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #b7b7b7;
            border-radius: 4px;
        }

        &::-webkit-scrollbar-track {
            box-shadow: 0 0 0px #808080 inset;
        }

        scrollbar-color: #b7b7b7 transparent;
        scrollbar-width: thin;

        &.show-list {
            // height: auto;
            max-height: 192px;
        }

        div {
            display: flex;
            justify-content: space-between;
            height: 32px;
            line-height: 32px;
            padding: 0 10px;
            cursor: pointer;
            color: #777;
            font-size: 12px;

            &.cur {
                background-color: #e4e4e4;
                border-left: 6px #8ea9a7 solid;
                padding-left: 4px;
            }

            &:hover {
                background-color: #efefef;
            }

            span {
                &.music-idx {
                    margin-right: 10px;
                }

                &.music-name {
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }

}
</style>