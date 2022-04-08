import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { retrieveDocument } from "../../utils/retrieveDocument";
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
    async pullItem(@Arg("name") name: string): Promise<Item> {
        //! implement spellChecking
        
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
        const urlName = name.replace(/ /g, "_");
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

        Object.assign(item, {
            caption,
            description,
            image,
        });
        return await item.save();
    }
}
