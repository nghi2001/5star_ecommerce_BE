import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { MediaFile } from './media.entity';

export enum BANNER_STATUS {
    ACTIVE = 1,
    INACTIVE = 2,
}
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


    @Column({ default: 1 })
    status: BANNER_STATUS

    @OneToOne(() => MediaFile)
    @JoinColumn({ name: 'image' })
    media
}