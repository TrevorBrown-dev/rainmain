export const formatTextMonster = (text: string): string => {
    return text.replace(/\n/g, " ").replace(/\s\s+/g, " ").trim();
}