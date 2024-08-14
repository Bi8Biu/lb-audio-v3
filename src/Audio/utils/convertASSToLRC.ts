function parseASSTime(assTime: string) {
    const [hours, minutes, seconds] = assTime.split(":");
    const [secs, millis] = seconds.split(".");
    return (
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(secs) +
        parseInt(millis) / 100
    );
}

function formatLRCLine(timeInSeconds: number, text: string) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = (timeInSeconds % 60).toFixed(2).padStart(5, "0");
    return `[${minutes}:${seconds}]${text.trim()}`;
}

export default function convertASSToLRC(assContent: string) {
    const lines = assContent.split("\n");
    const lrcLines: string[] = [];

    lines.forEach((line) => {
        if (line.startsWith("Dialogue:")) {
            const parts = line.split(",");
            const startTime = parseASSTime(parts[1]);
            const text = parts.slice(9).join(",").replace(/\\N/g, " "); // 合并文本部分并将 \N 替换为空格
            lrcLines.push(formatLRCLine(startTime, text));
        }
    });

    // 按时间对行进行排序
    lrcLines.sort();

    return lrcLines.join("\n");
}
