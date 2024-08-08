import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AnamnesisForm } from "./anamnesis_form";

@Entity()
export class AnamnesisSection extends BaseEntity {
  @Column()
  form_id: string;

  @ManyToOne(() => AnamnesisForm)
  @JoinColumn()
  form: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  order: number; // Maintain section order

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "anamnesis_section");
  }
}
