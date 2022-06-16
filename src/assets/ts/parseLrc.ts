/*
 * @Explain: xxx
 * @Author: SuperLy
 * @LastEditors: SuperLy
 * @Date: 2022-05-26 15:26:15
 * @LastEditTime: 2022-05-26 16:10:56
 * @FilePath: \NewBlog\src\components\Common\Music\ts\parseLrc.ts
 */
// 歌词列表类型
type Lrc = Array<{
	// 时间,单位：秒
	lineTime: number,
	// 歌词
	txt: string
}>

// 匹配歌词时间
const lrcTimeReg: RegExp = /\[(\d{2}):(\d{2}).(\d{2,3})]/g;

export default function parseLrc(lrc: string = ''): Lrc {
	const arr: Lrc = [];
	lrc.split('\n').forEach((item) => {
		// 匹配时间
		let time = lrcTimeReg.exec(item);

		// 若不存在时间，则跳过
		if (!time) return;

		// 匹配歌词
		let txt: string = item.replace(lrcTimeReg, '');

		// 过滤空白歌词
		if (txt === '') return;


		arr.push({
			lineTime: formateLrcTime(time),
			txt
		})

	})
	return arr;
}

export function formateLrcTime(times: RegExpExecArray): number {
	const result: number[] = []
	times.forEach((time, index) => {
		if (index >= 1 && index <= 3) {
			result.push(parseInt(time))
		}
	})
	return result[0] * 60 + result[1] + result[2] / 1000
}