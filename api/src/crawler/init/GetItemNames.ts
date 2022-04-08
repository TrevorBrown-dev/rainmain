import { Item } from "../../server/entities/Item";
import { retrieveDocument } from "../../utils/retrieveDocument";
export const getItemNames = async () => {
    const doc = await retrieveDocument(
        "https://riskofrain2.fandom.com/wiki/Items"
    );
    const itemTables = doc.querySelector("table");
    const itemNames =
        itemTables?.querySelectorAll<HTMLAnchorElement>("td > span > a");
    if (!itemNames || !itemNames.length) return;

    const itemNamesArray = Array.from(itemNames).map((item) => item.title);
    itemNamesArray.forEach(async (name) => {
        //For each item, if it doesn't exist, create it
        const item = await Item.findOne({
            where: { name },
        });
        if (!item) await Item.create({ name }).save();
    });
};
