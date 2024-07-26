/*
 * @Explain: xxx
 * @Author: SuperLy
 * @LastEditors: SuperLy
 * @Date: 2022-05-13 20:41:10
 * @LastEditTime: 2024-07-26 18:06:55
 */
import component from "./index.vue";
import { App } from "vue";
component.install = (app: App) => {
    app.component(component.name as string, component);
};
export default component;
