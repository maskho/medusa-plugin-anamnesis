import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AnamnesisForm } from "./anamnesis_form";

@Entity()
export class AnamnesisResponse extends BaseEntity {
  @Column()
  customer_id: string;

  @Column()
  order_id: string;

  @Column()
  form_id: string;

  @ManyToOne(() => AnamnesisForm)
  @JoinColumn({ name: "form_id" })
  form: string;

  @Column({ type: "jsonb", nullable: true })
  responses: any;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "anamnesis_response");
  }
}
