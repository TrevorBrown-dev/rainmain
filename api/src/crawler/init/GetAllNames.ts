import { getArtifactNames } from "./GetArtifact";
import { getChallenges } from "./GetChallenges";
import { getItemNames } from "./GetItemNames";
import { getMonsterNames } from "./GetMonsterNames";

export const getAllNames = async () => {
    getItemNames();
    getMonsterNames();
    getArtifactNames();
    getChallenges();
};
