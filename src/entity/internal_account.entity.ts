import { type } from 'os';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { ACCOUNT_STATUS } from 'src/common/enum';
@Entity()
export class InternalAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: 2 })
    status: ACCOUNT_STATUS;

    @Column()
    id_profile: number;

    @Column('jsonb', { default: {}, nullable: true })
    code?: any;

    @OneToOne(type => Profile)
    @JoinColumn({ name: 'id_profile' })
    profile: Profile;


    @Column('jsonb', { default: {} })
    refresh_token?: any;

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;
}