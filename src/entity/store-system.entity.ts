import { STORE_SYSTEM_STATUS } from "src/common/enum/store-system.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class StoreSystem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    time: string;

    @Column()
    open_close: string;

    @Column()
    phone: string;


    @Column()
    email: string;


    @Column()
    address: string;

    @Column({ default: STORE_SYSTEM_STATUS.ACTIVE })
    status: STORE_SYSTEM_STATUS;

    @Column({ nullable: true })
    @CreateDateColumn()
    create_at: Date;

    @Column({ nullable: true })
    @UpdateDateColumn()
    update_at: Date;
}