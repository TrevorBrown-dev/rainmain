import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { formatTextMonster } from '../../utils/formatTexts/formatTextMonster';
import { retrieveDocument } from '../../utils/retrieveDocument';
import { spellCheck } from '../../utils/spellCheck';
import { Monster } from '../entities/Monster';
import { MonsterStat } from '../entities/MonsterStat';

@Resolver(Monster)
export class MonsterResolver {
    @Query(() => Monster)
    async monster(@Arg('name') weakName: string): Promise<Monster | undefined> {
        const { name } = spellCheck(weakName, await Monster.find());
        return await Monster.findOne({ where: { name }, relations: ['stats'] });
    }

    @Query(() => [Monster])
    async monsters(): Promise<Monster[]> {
        return await Monster.find({ relations: ['stats'] });
    }

    @Mutation(() => Monster)
    async pullMonster(@Arg('name') weakName: string): Promise<Monster> {
        //Check weakName against list of all names and return the best match
        const { name } = spellCheck(weakName, await Monster.find());

        //Pull best match monster
        const monster = await Monster.findOne({
            where: { name },
            relations: ['stats'],
        });
        if (!monster)
            throw {
                Error: [
                    {
                        message: `Monster ${name} not found.`,
                        location: 'MonsterResolver.pullMonster',
                    },
                ],
            };

        //Make monster name useable in url
        const urlName = name.replace(/ /g, '_');

        //Pull monster from wiki
        const doc = await retrieveDocument(
            `https://riskofrain2.fandom.com/wiki/${urlName}`
        );
        if (!doc)
            throw {
                Error: [
                    {
                        message: `Monster ${name} not found on wiki.`,
                        location: 'MonsterResolver.pullMonster',
                    },
                ],
            };

        //Grab monster's description, image, caption, and stats
        const description = doc.querySelector(
            '.mw-parser-output p'
        )?.textContent;
        const image = (
            doc.querySelector('.infoboxtable img') as HTMLImageElement
        )?.src;

        const temp = doc.querySelector('.infoboxcaption')?.textContent;
        const caption = temp?.trim().replace(/\n+/, '');

        const table = doc.querySelector('.infoboxtable');

        if (!image || !description || !table)
            throw {
                Error: [
                    {
                        message: `Monster ${name}'s content not found.`,
                        location: 'MonsterResolver.pullMonster',
                    },
                ],
            };

        let rows = table.querySelectorAll('tr');
        //Deletes all old stats
        await MonsterStat.delete({ owner: monster });

        //Assigns new stats
        const stats: MonsterStat[] = [];
        for (let i = caption ? 3 : 2; i < rows.length; i++) {
            let cells = rows[i].querySelectorAll('td');

            if (cells[0].textContent && cells[1].textContent) {
                stats.push(
                    await MonsterStat.create({
                        name: cells[0].textContent,
                        value: formatTextMonster(
                            cells[1].textContent
                                ?.replace(/\(/g, '*(')
                                .replace(/\)/g, ')*')
                        ),
                        owner: monster,
                    }).save()
                );
            }
        }

        //Update item
        Object.assign(monster, {
            caption,
            description: formatTextMonster(description),
            image,
            stats,
        });

        const newMon = await monster.save();
        console.log(newMon.stats);

        //Save item and return
        await newMon.reload();
        return newMon;
    }
}
