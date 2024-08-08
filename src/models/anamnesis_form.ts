import { BeforeInsert, Column, Entity } from "typeorm";
import { BaseEntity, generateEntityId } from "@medusajs/medusa";

@Entity()
export class AnamnesisForm extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "anamnesis_form");
  }
}
