import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AnamnesisSection } from "../../../../../models/anamnesis_section";
import { EntityManager } from "typeorm";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const sectionRepo = manager.getRepository(AnamnesisSection);

    let anyreq = req as any;
    let section = { ...anyreq.body };

    const newSection = sectionRepo.create(section);

    await sectionRepo.save(newSection);

    return res.json({ success: true, section: { ...newSection } });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
