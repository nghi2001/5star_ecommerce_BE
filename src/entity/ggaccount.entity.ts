import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
@Entity()
export class GGAccount extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    uid: string;

    @Column()
    id_profile: number;

    @OneToOne(type => Profile)
    @JoinColumn({ name: 'id_profile' })
    profile: Profile;

    @Column()
    @CreateDateColumn()
    create_at: Date

    @Column()
    @UpdateDateColumn()
    update_at: Date
}