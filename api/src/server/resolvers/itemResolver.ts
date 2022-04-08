import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { retrieveDocument } from "../../utils/retrieveDocument";
import { spellCheck } from "../../utils/spellCheck";
import { Item } from "../entities/Item";

@Resolver(Item)
export class ItemResolver {
    @Query(() => Item)
    async item(@Arg("name") name: string): Promise<Item | undefined> {
        return await Item.findOne({ where: { name } });
    }

    @Query(() => [Item])
    async items(): Promise<Item[]> {
        return await Item.find();
    }

    @Mutation(() => Item)
    async pullItem(@Arg("name") weakName: string): Promise<Item> {
        //Check weakName against list of all names and return the best match
        const { name } = spellCheck(weakName, await Item.find());
        
        //Pull best match item
        const item = await Item.findOne({ where: { name } });
        if (!item)
            throw {
                Error: [
                    {
                        message: `Item ${name} not found.`,
                        location: "ItemResolver.pullItem",
                    },
                ],
            };

        //Make item name useable in url
        const urlName = name.replace(/ /g, "_");
        

        //Pull item from wiki
        const doc = await retrieveDocument(
            `https://riskofrain2.fandom.com/wiki/${urlName}`
        );
        if (!doc)
            throw {
                Error: [
                    {
                        message: `Item ${name} not found on wiki.`,
                        location: "ItemResolver.pullItem",
                    },
                ],
            };

        //Grab item's description, image, and caption
        const caption = doc.querySelector(".infoboxcaption")?.textContent;

        const description = doc.querySelector(".infoboxdesc")?.textContent;

        const image = (
            doc.querySelector(".infoboxtable img") as HTMLImageElement
        )?.src;

        if (!caption || !description || !image)
            throw {
                Error: [
                    {
                        message: `Item ${name}'s content not found.`,
                        location: "ItemResolver.pullItem",
                    },
                ],
            };
        
        //Update item
        Object.assign(item, {
            caption,
            description,
            image,
        });
        //Save item and return
        return await item.save();
    }
}
