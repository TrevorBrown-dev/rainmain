import { Arg, Query, Resolver } from "type-graphql";
import { spellCheck } from "../../utils/spellCheck";
import { Artifact } from "../entities/Artifact";

@Resolver(Artifact)
export class ArtifactResolver {
    @Query(() => Artifact)
    async artifact(
        @Arg("name") weakName: string
    ): Promise<Artifact | undefined> {
        const { name } = spellCheck(weakName, await Artifact.find());
        return await Artifact.findOne({ where: { name } });
    }

    @Query(() => [Artifact])
    async artifacts(): Promise<Artifact[]> {
        return await Artifact.find();
    }
}
