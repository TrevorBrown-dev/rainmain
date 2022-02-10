import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum NameTypes {
    Item = 'item',
    Monster = 'monster',
    Artifact = 'artifact',
    Challenege = 'challenge',
    Drone = 'drone',
    Environment = 'environment',
    Interactable = 'interactable',
    Lore = 'lore',
    Skill = 'skill',
    Survivor = 'survivor',
}
registerEnumType(NameTypes, {
    name: 'NameTypes',
    description: 'The type of entity this is.',
});

@ObjectType()
@Entity()
export class Name extends BaseEntity {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    name!: string;

    @Field(() => NameTypes)
    @Column()
    type!: NameTypes;
}
