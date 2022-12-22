import { RATING_STATUS } from "src/common/enum";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { Profile } from "./profile.entity";

@Entity()
export class Rating extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    rating: number;

    @Column({ nullable: true })
    content: string;

    @Column()
    id_user: number;

    @Column()
    id_product: number;

    @Column({ default: RATING_STATUS.ACTIVE })
    status: RATING_STATUS

    @ManyToOne(() => Product, (product) => product.ratings)
    @JoinColumn({ name: 'id_product' })
    product: Product[];

    @ManyToOne(() => Profile)
    @JoinColumn({ name: "id_user" })
    user: Profile[];

    @Column({ nullable: true })
    @CreateDateColumn()
    create_at: Date;

    @Column({ nullable: true })
    @UpdateDateColumn()
    update_at: Date;
}