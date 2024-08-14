export type musicItemType = {
    name: string;
    author: string;
    url: string;
    img: string;
    lrc: string;
};

export type musicListType = musicItemType[];
export type playOrderType = "along" | "random" | "loop";
