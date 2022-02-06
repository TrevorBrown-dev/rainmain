import { JSDOM } from 'jsdom';

const retrieveDocument = async (url: string) => {
    return await (
        await JSDOM.fromURL(url)
    ).window.document;
};

const doc = await retrieveDocument('https://riskofrain2.fandom.com/wiki/Items');
doc.querySelectorAll('div').forEach((div) => {
    console.log(div.textContent);
});
