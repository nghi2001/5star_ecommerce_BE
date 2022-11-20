import { type } from 'os';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from './user.entity';
@Entity()
export class InternalAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    id_profile: number;

    @Column({ nullable: true })
    code?: string;

    @OneToOne(type => Profile)
    @JoinColumn({ name: 'id_profile' })
    profile: Profile;


    @Column({ nullable: true })
    refresh_token?: string;

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;
}