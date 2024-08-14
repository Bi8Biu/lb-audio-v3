import Audio from "./index.vue";
import { App } from "vue";

import convertASSToLRC from "./utils/convertASSToLRC";
import type { musicItemType, musicListType, playOrderType } from "./type";

Audio.install = (app: App) => {
    app.component(Audio.name as string, Audio);
};
export default Audio;

export { convertASSToLRC, musicItemType, musicListType, playOrderType };
