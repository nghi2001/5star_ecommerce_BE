import { type } from 'os';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import { Profile } from './user.entity';
@Entity()
export class InternalAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    id_profile: number

    @OneToOne(type => Profile)
    @JoinColumn({name: 'id_profile'})
    profile: Profile
}