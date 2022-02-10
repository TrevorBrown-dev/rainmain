import { ExpressContext } from 'apollo-server-express';

export type MyContext = {
    req: ExpressContext;
};
