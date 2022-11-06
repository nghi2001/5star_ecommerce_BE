import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Category } from './Category.entity';
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

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date
}