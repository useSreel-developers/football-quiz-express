import {
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { User } from "./User";
  
  @Entity("transactions")
  export class Transaction {
    @PrimaryColumn({ type: "uuid" })
      id!: string;
  
    @CreateDateColumn({ type: "timestamp with time zone" })
      created_at!: Date;
  
    @UpdateDateColumn({ type: "timestamp with time zone" })
      updated_at!: Date;

    @ManyToOne (() => User, (user) => user.transactions, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
      user!: User;
  }
  