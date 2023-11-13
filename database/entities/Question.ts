import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("questions")
export class Question {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ length: 250 })
    question!: string;

  @Column({ length: 100 })
    answer_a!: string;

  @Column({ length: 100 })
    answer_b!: string;

  @Column({ length: 100 })
    answer_c!: string;

  @Column({ length: 100 })
    answer_d!: string;

  @Column({ length: 1 })
    correct_answer!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
