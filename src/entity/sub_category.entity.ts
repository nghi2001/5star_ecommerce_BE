import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Category } from './Category.entity';
import { Product } from './product.entity';
@Entity()
export class Sub_Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;
    
    @Column()
    slug: string;
    
    @Column()
    status: number;
    
    @Column()
    id_category: number;

    @ManyToOne(() => Category, (category) => category.sub_categorys)
    @JoinColumn({name: 'id_category'})
    category: Category;

    @OneToMany(() => Product, (product) => product.sub_category)
    products: Product[];

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date
}