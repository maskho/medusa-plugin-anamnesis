import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AnamnesisSection } from "./anamnesis_section";

export enum QuestionType {
  SHORT_ANSWER = "short_answer",
  LONG_ANSWER = "long_answer",
  DATE = "date",
  DATE_TIME = "date_time",
  TIME = "time",
  MULTIPLE_CHOICE = "multiple_choice",
  SELECT = "select",
}

@Entity()
export class AnamnesisQuestion extends BaseEntity {
  @Column()
  section_id: string;

  @ManyToOne(() => AnamnesisSection)
  @JoinColumn()
  section: string;

  @Column()
  question_text: string;

  @Column({ type: "enum", enum: QuestionType })
  question_type: QuestionType;

  @Column({ type: "jsonb", nullable: true }) // Used for multiple_choice and select types
  options: any;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "anamnesis_question");
  }
}
