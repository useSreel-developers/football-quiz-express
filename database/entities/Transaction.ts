import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";

@Entity("transactions")
export class Transaction {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({length: 50})
    order_id!: string;
  
  @Column()
    gross_amount!: number;

  @Column({ length: 100 })
    name!: string;

  @Column({ length: 50 })
    email!: string;

  @Column()
    diamond!: number;
  
  @Column({ length: 500 })
    status!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
