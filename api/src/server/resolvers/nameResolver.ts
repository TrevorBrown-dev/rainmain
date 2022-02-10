import { Arg, Query, Resolver } from 'type-graphql';
import { Name } from '../entities/Name';

@Resolver(Name)
export class NameResolver {
    @Query(() => Name)
    async name(@Arg('id') id: number) {
        return await Name.findOne(id);
    }

    @Query(() => [Name])
    async names() {
        return await Name.find();
    }
}
