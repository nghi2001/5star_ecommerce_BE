import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;
    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    gender: string;

    @Column('text',{array: true})
    address: string[];

    @Column({default: false})
    is_active: boolean;

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;
}