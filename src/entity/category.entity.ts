import { Sub_Category } from 'src/entity/sub_category.entity'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    status: number;

    @Column()
    parent_id: number;

    @ManyToOne(() => Category, (category) => category.sub_category)
    @JoinColumn({ name: 'parent_id' })
    parent_category: Category;

    @OneToMany(() => Category, (sub_category) => sub_category.parent_category)
    sub_category: Category[];

    @OneToMany(() => Sub_Category, (sub_category) => sub_category.category)
    sub_categorys: Sub_Category[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date
}