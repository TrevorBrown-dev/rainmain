import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { formatTextItem } from '../../utils/formatTexts/formatTextItem';
import { retrieveDocument } from '../../utils/retrieveDocument';
import { spellCheck } from '../../utils/spellCheck';
import { Artifact } from '../entities/artifact';

@Resolver(Artifact)
export class ArtifactResolver {
    @Query(() => Artifact)
    async artifact(
        @Arg('name') weakName: string
    ): Promise<Artifact | undefined> {
        const { name } = spellCheck(weakName, await Artifact.find());
        return await Artifact.findOne({ where: { name } });
    }

    @Query(() => [Artifact])
    async artifacts(): Promise<Artifact[]> {
        return await Artifact.find();
    }

    @Mutation(() => Artifact)
    async pullArtifact(@Arg('name') weakName: string): Promise<Artifact> {
        //Check weakName against list of all names and return the best match
        const { name } = spellCheck(weakName, await Artifact.find());

        //Pull best match item
        const artifact = await Artifact.findOne({ where: { name } });
        if (!artifact)
            throw {
                Error: [
                    {
                        message: `Artifact ${name} not found.`,
                        location: 'ArtifactResolver.pullArtifact',
                    },
                ],
            };

        //Make item name useable in url
        const urlName = name.replace(/ /g, '_');

        //Pull item from wiki
        const doc = await retrieveDocument(
            `https://riskofrain2.fandom.com/wiki/${urlName}`
        );
        if (!doc)
            throw {
                Error: [
                    {
                        message: `Artifact ${name} not found on wiki.`,
                        location: 'ArtifactResolver.pullArtifact',
                    },
                ],
            };

        //Grab item's description, image, and caption
        const caption = doc.querySelector('.infoboxcaption')?.textContent;

        const description = doc.querySelector('.infoboxdesc')?.textContent;

        const image = (
            doc.querySelector('.infoboxtable img') as HTMLImageElement
        )?.src;

        if (!caption || !description || !image)
            throw {
                Error: [
                    {
                        message: `Artifact ${name}'s content not found.`,
                        location: 'ArtifactResolver.pullArtifact',
                    },
                ],
            };

        //Update item
        Object.assign(artifact, {
            caption: formatTextItem(caption),
            description: formatTextItem(description),
            image,
        });
        //Save item and return
        return await artifact.save();
    }
}
