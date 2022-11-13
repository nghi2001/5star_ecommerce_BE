import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './Category.entity';
import { Stock } from './stock.entity';
import { Sub_Category } from './sub_category.entity';

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

    @Column('text', { array: true, nullable: true })
    image: string[];

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
}