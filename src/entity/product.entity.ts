import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { MediaFile } from './media.entity';
import { Rating } from './rating.entity';
import { Stock } from './stock.entity';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: "text", array: true, nullable: true })
    info_detail: string[];

    // @Column('text', { array: true, nullable: true })
    // image: string[];

    @Column({ nullable: true })
    slug: string;

    @Column({ default: 0, nullable: true })
    sold: number;

    @Column({ default: 0 })
    status: number;

    @Column({ default: 0 })
    views: number;
    @Column()
    id_category: number;

    @Column({ nullable: true })
    id_brand: number;

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'id_category' })
    category: Category;

    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn({ name: "id_brand" })
    brand: Brand;

    @OneToMany(() => Stock, (stock) => stock.product, { onDelete: 'CASCADE' })
    stocks: Stock[]

    @ManyToMany(() => MediaFile)
    @JoinTable()
    images: MediaFile[];

    @OneToMany(() => Rating, (rating) => rating.product)
    ratings: Rating[]
}