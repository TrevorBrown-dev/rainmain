import { Arg, Query, Resolver } from "type-graphql";
import { spellCheck } from "../../utils/spellCheck";
import { Challenge } from "../entities/Challenge";

@Resolver(Challenge)
export class ChallengeResolver {
    @Query(() => Challenge)
    async challenge(
        @Arg("title") weakName: string
    ): Promise<Challenge | undefined> {
        const { name } = spellCheck(weakName, await Challenge.find());
        return await Challenge.findOne({ where: { name } });
    }

    @Query(() => [Challenge])
    async challenges(): Promise<Challenge[]> {
        return await Challenge.find();
    }
}
