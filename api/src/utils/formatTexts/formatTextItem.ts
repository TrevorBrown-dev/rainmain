export const formatTextItem = (text: string) => {
    text = text.trim().replace(/(\r\n|\n|\r){2,}/gm, "\n\n");
    text = text.replace(/\(/g, "*(");
    text = text.replace(/\)/g, ")*");
    return text;
};
