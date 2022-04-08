import { ObjectType, Field } from 'type-graphql';
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Monster } from './Monster';

@ObjectType()
@Entity()
export class MonsterStat extends BaseEntity {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    name: string;

    @Field(() => String)
    @Column()
    value: String;

    @Field(() => Monster)
    @ManyToOne((type) => Monster, (monster) => monster.stats)
    owner: Monster;
}
