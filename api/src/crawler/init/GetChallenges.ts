import { Challenge } from "../../server/entities/Challenge";
import { retrieveDocument } from "../../utils/retrieveDocument";

export const getChallenges = async () => {
    const doc = await retrieveDocument(
        "https://riskofrain2.fandom.com/wiki/Challenges"
    );
    const challengeTable = doc.querySelector(".mw-parser-output");
    const challenges = challengeTable?.querySelectorAll<HTMLAnchorElement>(
        ".divTableWithFloatingHeader > table > tbody > tr > td"
    );
    if (!challenges || !challenges.length) return;
    for (let i = 0; i < challenges.length; i += 3) {
        const name = challenges[i].textContent?.replace(/\n+/, "");
        const image = challenges[i + 2].querySelector("img")?.src;
        const description = challenges[i + 1].textContent?.replace(/\n+/, "");
        const unlock = challenges[i + 2].textContent?.replace(/\n+/, "");
        if (name) {
            const challenge = await Challenge.findOne({
                where: { name },
            });
            if (!challenge)
                await Challenge.create({
                    name,
                    image,
                    description,
                    unlock,
                }).save();
            else {
                Object.assign(challenge, {
                    image,
                    description,
                    unlock,
                });
                await challenge.save();
            }
        }
    }
};
