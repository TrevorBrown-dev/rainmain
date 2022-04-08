import { getArtifactNames } from './GetArtifactNames';
import { getItemNames } from './GetItemNames';
import { getMonsterNames } from './GetMonsterNames';

export const getAllNames = async () => {
    getItemNames();
    getMonsterNames();
    getArtifactNames();
};
