import { Artifact } from '../../server/entities/artifact';
import { formatTextArtifact } from '../../utils/formatTexts/formatTextArtifact';
import { retrieveDocument } from '../../utils/retrieveDocument';

export const getArtifactNames = async () => {
    const doc = await retrieveDocument(
        'https://riskofrain2.fandom.com/wiki/Artifacts'
    );
    const artifactTable = doc.querySelector('.article-table > tbody');
    const artifacts =
        artifactTable?.querySelectorAll<HTMLAnchorElement>('tr > td');
    if (!artifacts || !artifacts.length) return;
    //iterate over every other element, because the first element is the header
    for (let i = 0; i < artifacts.length; i += 3) {
        const name = artifacts[i].textContent?.replace(/\n+/, '');
        const image = artifacts[i].querySelector('img')?.src;
        const description = artifacts[i + 1].textContent?.replace(/\n+/, '');
        const temp = artifacts[i + 2].textContent?.replace(/\n+/, '');
        if (!temp)
            throw {
                Error: [
                    {
                        message: `Artifact ${name}'s password not found.`,
                        location: 'getArtifactNames',
                    },
                ],
            };
        const password = formatTextArtifact(temp);
        //For each artifact, if it doesn't exist, create it
        if (name) {
            const artifact = await Artifact.findOne({
                where: { name },
            });
            if (!artifact)
                await Artifact.create({
                    name,
                    image,
                    description,
                    password,
                }).save();
            else {
                Object.assign(artifact, {
                    image,
                    description,
                    password,
                });
                await artifact.save();
            }
        }
    }
};
