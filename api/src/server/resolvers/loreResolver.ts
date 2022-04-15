import { Arg, Query, Resolver } from "type-graphql";
import { spellCheck } from "../../utils/spellCheck";
import { Lore } from "../entities/Lore";

@Resolver(Lore)
export class LoreResolver {
    @Query(() => Lore)
    async lore(@Arg("title") weakName: string): Promise<Lore | undefined> {
        const { name } = spellCheck(weakName, await Lore.find());
        return await Lore.findOne({ where: { name } });
    }

    @Query(() => [Lore])
    async lores(): Promise<Lore[]> {
        return await Lore.find();
    }
}
