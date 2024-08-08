import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AnamnesisForm } from "../../../models/anamnesis_form";
import { AnamnesisQuestion } from "../../../models/anamnesis_question";
import { AnamnesisResponse } from "../../../models/anamnesis_response";
import { AnamnesisSection } from "../../../models/anamnesis_section";
import { EntityManager, In } from "typeorm";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const responseRepo = manager.getRepository(AnamnesisResponse);
    const questionRepo = manager.getRepository(AnamnesisQuestion);
    const sectionRepo = manager.getRepository(AnamnesisSection);
    const formRepo = manager.getRepository(AnamnesisForm);

    let anyreq = req as any;
    const response = { ...anyreq.body };

    const form = await formRepo.exist({ where: { id: response.form_id } });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    const sections = await sectionRepo.find({
      where: { form_id: response.form_id },
      select: ["id"],
    });

    const sectionIds = sections.map((s) => s.id);

    // Check if all questions are answered
    const questions = await questionRepo.find({
      where: { section_id: In(sectionIds) },
      select: ["id"],
    });

    const responseMap = response.responses.reduce((acc, r) => {
      acc[r.qiestion_id] = r.answer;
      return acc;
    }, {});

    const missingQuestions = questions.filter((q) => !responseMap[q.id]);

    if (missingQuestions.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing answers" }); // TODO: Fix this
    }

    const newResponse = responseRepo.create(response);

    await responseRepo.save(newResponse);

    return res.json({ success: true, response: { ...newResponse } });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
