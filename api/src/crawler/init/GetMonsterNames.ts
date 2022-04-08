
import { Monster } from "../../server/entities/Monster";
import { retrieveDocument } from "../../utils/retrieveDocument";
export const getMonsterNames = async () => {
    const doc = await retrieveDocument(
        "https://riskofrain2.fandom.com/wiki/Monsters"
    );
    
    const monsterTables = doc.querySelector(".mw-parser-output");
    
    const monsterNames =
        monsterTables?.querySelectorAll<HTMLAnchorElement>(".gallerybox > div > .gallerytext > p > .tooltip > span > a");
        
    if (!monsterNames || !monsterNames.length) return;

    const monsterNamesArray = Array.from(monsterNames).map((monster) => monster.title);
    
    monsterNamesArray.forEach(async (name) => {
        
        //For each item, if it doesn't exist, create it
        const monster = await Monster.findOne({
            where: { name },
        });
        if (!monster) await Monster.create({ name }).save();
    });
};
