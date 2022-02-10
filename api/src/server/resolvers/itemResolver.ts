import { Arg, Query, Resolver } from 'type-graphql';
import { Item } from '../entities/Item';

@Resolver(Item)
export class ItemResolver {
    @Query(() => Item)
    async item(@Arg('id') id: number) {
        return await Item.findOne(id);
    }
}
