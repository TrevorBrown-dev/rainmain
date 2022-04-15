import { Lore } from "../../server/entities/Lore";
import { retrieveDocument } from "../../utils/retrieveDocument";

export const getLore = async () => {
    const doc = await retrieveDocument(
        "https://riskofrain2.fandom.com/wiki/Lore"
    );
    const loreTable = doc.querySelector(".mw-parser-output");
    const lores = loreTable?.querySelectorAll<HTMLAnchorElement>("div");

    if (!lores || !lores.length) return;
    //iterate over every other element, because the first element is the header
    for (let i = 0; i < lores.length; i += 3) {
        if (
            lores[i].querySelector("div > a") &&
            lores[i].querySelector("pre")
        ) {
            const name = lores[i]
                .querySelector("div > a")
                ?.textContent?.replace(/\n+/, "");
            const text = lores[i + 1]
                .querySelector("pre")
                ?.textContent?.replace(/\n+/, "");
            if (name && text) {
                const lore = await Lore.findOne({
                    where: { name },
                });
                if (!lore)
                    await Lore.create({
                        name,
                        text,
                    }).save();
                else {
                    Object.assign(lore, {
                        name,
                        text,
                    });
                    await lore.save();
                }
            }
        }
    }
};
