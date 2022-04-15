import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { buildSchema, NonEmptyArray } from "type-graphql";
import { createConnection } from "typeorm";
import { getAllNames } from "./crawler/init/GetAllNames";
import ormConfig from "./ormconfig";
import { ArtifactResolver } from "./server/resolvers/artifactResolver";
import { ChallengeResolver } from "./server/resolvers/challengeResolver";
import { ItemResolver } from "./server/resolvers/itemResolver";
import { LoreResolver } from "./server/resolvers/loreResolver";
import { MonsterResolver } from "./server/resolvers/monsterResolver";
import { MyContext } from "./types";
// const doc = await retrieveDocument('https://riskofrain2.fandom.com/wiki/Items');
// doc.querySelectorAll('div').forEach((div) => {
//     console.log(div.textContent);
// });

getAllNames();

const resolverList: NonEmptyArray<Function> | NonEmptyArray<string> = [
    ItemResolver,
    MonsterResolver,
    ArtifactResolver,
    ChallengeResolver,
    LoreResolver,
];

const main = async () => {
    await createConnection(ormConfig);

    const app = express();

    app.use(express.json({ limit: "50mb" }));

    app.use(
        cors({
            origin: "http://localhost",
            credentials: true,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: resolverList,
            validate: false,
        }),
        context: (req): MyContext => ({ req }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: {
            origin: "http://localhost",
            credentials: true,
        },
    });
    app.get("/", (_, res) => {
        res.redirect(apolloServer.graphqlPath);
    });
    app.listen(4000, () => {
        console.log("server started at http://localhost/graphql");
    });
};

main();
