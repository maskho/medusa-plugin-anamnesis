import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AnamnesisQuestion } from "../../../../../../models/anamnesis_question";
import { EntityManager } from "typeorm";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const questionRepo = manager.getRepository(AnamnesisQuestion);

    let anyreq = req as any;
    let question = { ...anyreq.body };

    const newQuestion = questionRepo.create(question);

    await questionRepo.save(newQuestion);

    return res.json({ success: true, question: { ...newQuestion } });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
