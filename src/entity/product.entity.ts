import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './Category.entity';
import { Sock } from './sock.entity';
import { Sub_Category } from './sub_category.entity';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column()
    decription: string;

    @Column('text', { array: true })
    image: string[];

    @Column()
    slug: string;

    @Column({ default: 0 })
    sold: number;

    @Column()
    status: number;

    @Column({ default: 0 })
    views: number;
    @Column()
    id_category: number;

    @Column()
    id_subcategory: number;

    @Column()
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

    @OneToMany(() => Sock, (sock) => sock.product)
    socks: Sock[]
}