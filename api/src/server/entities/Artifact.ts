import { ObjectType, Field } from 'type-graphql';
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Artifact extends BaseEntity {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: true })
    @Column({ unique: true })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    password: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    image: string;

    @Field(() => Date)
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
