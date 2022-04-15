import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Challenge extends BaseEntity {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: true })
    @Column({ unique: true })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    unlock: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    image: string;

    @Field(() => Date)
    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;
}
