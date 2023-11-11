import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Avatar } from "./Avatar";

@Entity("users")
export class User {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ type: "text" })
    google_id!: string;

  @Column({ length: 100 })
    fullname!: string;

  @Column({ length: 50 })
    email!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;

  @ManyToOne(() => Avatar, (avatar) => avatar.users, {
    onUpdate: "SET NULL",
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "avatar_id" }) // untuk membuat foreignkey
    avatar!: Avatar;
}
