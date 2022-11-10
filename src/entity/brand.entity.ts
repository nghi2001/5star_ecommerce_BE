import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Brand extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    slug: string;

    @OneToMany(() => Product, (product) => product.brnad)
    products: Product[]

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;
}