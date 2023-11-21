import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
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

  @ManyToMany(() => User, (user) => user.avatars_owned, { cascade: true })
  @JoinTable({
    name: "user_avatar",
    joinColumn: {
      name: "avatar_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
    avatar_owners!: User[];
}
