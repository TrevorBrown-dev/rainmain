import { similarity } from './checkSimilarity';

export interface canBeChecked {
    name: string;
}

//takes in a name and the array of objects with name attribute and returns the closest item
export const spellCheck = (name: string, arr: canBeChecked[]) => {
    let best: [canBeChecked, number] = [arr[0], similarity(arr[0].name, name)];
    arr.forEach((item) => {
        const newSimilarity = similarity(item.name, name);
        if (newSimilarity > best[1]) best = [item, newSimilarity];
    });
    return best[0];
};
