import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { Avatar } from "./Avatar";

@Entity("users")
export class User {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ length: 100 })
    name!: string;

  @Column({ length: 50 })
    email!: string;

  @Column({ default: 0 })
    diamond!: number;

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

  @ManyToMany(() => Avatar, (avatar) => avatar.avatar_owners)
    avatars_owned!: Avatar[];
}
