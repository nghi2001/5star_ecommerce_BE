import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { BRAND_STATUS } from 'src/common/enum';
@Entity()
export class Brand extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column({ default: 1 })
    status: BRAND_STATUS;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[]

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;
}