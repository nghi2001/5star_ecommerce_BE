import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MediaFile } from './media.entity';
import { BANNER_STATUS } from 'src/common/enum';
@Entity()
export class Banner extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    title: string;

    @Column()
    sub_title: string;

    @Column({ nullable: true })
    image?: number;

    @Column({ nullable: true })
    link?: string;


    @Column({ default: 1 })
    status: BANNER_STATUS

    @OneToOne(() => MediaFile)
    @JoinColumn({ name: 'image' })
    media

    @Column()
    @CreateDateColumn()
    create_at: Date

    @Column()
    @UpdateDateColumn()
    update_at: Date
}