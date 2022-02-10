import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Item extends BaseEntity {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id!: number;
}
