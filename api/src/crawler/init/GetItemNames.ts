import { Name, NameTypes } from '../../server/entities/Name';
import { retrieveDocument } from '../../utils/retrieveDocument';
export const getItemNames = async () => {
    const doc = await retrieveDocument(
        'https://riskofrain2.fandom.com/wiki/Items'
    );
    const itemTables = doc.querySelector('table');
    console.log(itemTables);
    const itemNames =
        itemTables?.querySelectorAll<HTMLAnchorElement>('td > span > a');
    if (!itemNames || !itemNames.length) return;
    const itemNamesArray = Array.from(itemNames).map((item) => item.title);
    itemNamesArray.forEach(async (itemName) => {
        //For each item, if it doesn't exist, create it
        const item = await Name.findOne({
            where: { name: itemName, type: NameTypes.Item },
        });
        if (!item) {
            await Name.create({ name: itemName, type: NameTypes.Item }).save();
        }
    });
};
