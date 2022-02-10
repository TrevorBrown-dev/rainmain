import { JSDOM } from 'jsdom';
export const retrieveDocument = async (url: string) => {
    return await (
        await JSDOM.fromURL(url)
    ).window.document;
};
