/*
 * @Explain: xxx
 * @Author: SuperLy
 * @LastEditors: SuperLy
 * @Date: 2022-05-13 20:41:10
 * @LastEditTime: 2022-06-16 16:16:55
 * @FilePath: \lb-audio-v3\src\Audio\index.ts
 */
import component from "./index.vue";
import { App } from 'vue';
component.install = (app: App) => {
	app.component(component.name, component)

}
export default component;