import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";

@Entity("avatars")
export class Avatar {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ type: "text" })
    avatar_url!: string;

  @Column({ length: 50 })
    avatar_name!: string;

  @Column({ default: 0 })
    price!: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;

  @OneToMany(() => User, (user) => user.avatar)
    users!: User[];
}
