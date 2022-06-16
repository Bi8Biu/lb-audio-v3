/*
 * @Explain: xxx
 * @Author: SuperLy
 * @LastEditors: SuperLy
 * @Date: 2022-05-25 15:52:55
 * @LastEditTime: 2022-05-25 16:48:16
 * @FilePath: \NewBlog\src\components\Common\Music\ts\getOffset.ts
 */
// 获取元素距离页面的 X,Y 坐标
const getOffset = (DOM: HTMLElement): { X: number, Y: number } => {
	if (!DOM) {
		return {
			X: NaN,
			Y: NaN
		}
	}
	let offset = {
		X: DOM.offsetLeft,
		Y: DOM.offsetTop
	};
	if (DOM.offsetParent != null) {
		offset.X += getOffset(DOM.offsetParent as HTMLElement).X;
		offset.Y += getOffset(DOM.offsetParent as HTMLElement).Y;
	}
	return offset;
}
export default getOffset;