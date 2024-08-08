import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AnamnesisQuestion } from "../../../../../../../models/anamnesis_question";
import { SqlSanitization } from "../../../../../../../utils/sql_sanitization";
import { EntityManager } from "typeorm";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const questionRepo = manager.getRepository(AnamnesisQuestion);

    let anyreq = req as any;
    const id = anyreq.params.id;
    const sanitizedId = SqlSanitization(id).includes("anamnesis_question_")
      ? SqlSanitization(id)
      : "anamnesis_question_" + SqlSanitization(id);

    const exists = await questionRepo.exist({ where: { id: sanitizedId } });

    if (!exists) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    await questionRepo.delete({ id: sanitizedId });

    return res.json({ success: true });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
