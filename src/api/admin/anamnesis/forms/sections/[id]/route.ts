import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AnamnesisSection } from "../../../../../../models/anamnesis_section";
import { SqlSanitization } from "../../../../../../utils/sql_sanitization";
import { EntityManager } from "typeorm";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const sectionRepo = manager.getRepository(AnamnesisSection);

    let anyreq = req as any;
    const id = anyreq.params.id;
    const sanitizedId = SqlSanitization(id).includes("anamnesis_section_")
      ? SqlSanitization(id)
      : "anamnesis_section_" + SqlSanitization(id);

    const exists = await sectionRepo.exist({ where: { id: sanitizedId } });

    if (!exists) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    await sectionRepo.delete({ id: sanitizedId });

    return res.json({ success: true });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
