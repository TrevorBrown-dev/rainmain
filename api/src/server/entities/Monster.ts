import { ObjectType, Field } from 'type-graphql';
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { MonsterStat } from './MonsterStat';

export type stat = [{ name: string; value: string }];

@ObjectType()
@Entity()
export class Monster extends BaseEntity {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: true })
    @Column({ unique: true })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    caption: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    image: string;

    @Field(() => [MonsterStat], { nullable: true })
    @OneToMany((type) => MonsterStat, (stat) => stat.owner, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: true,
    })
    stats!: MonsterStat[];

    @Field(() => Date)
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
