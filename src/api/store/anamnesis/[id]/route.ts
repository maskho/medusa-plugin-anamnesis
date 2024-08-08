import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AnamnesisForm } from "../../../../models/anamnesis_form";
import { AnamnesisQuestion } from "../../../../models/anamnesis_question";
import { AnamnesisSection } from "../../../../models/anamnesis_section";
import { SqlSanitization } from "../../../../utils/sql_sanitization";
import { EntityManager } from "typeorm";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const formRepo = manager.getRepository(AnamnesisForm);
    const sectionRepo = manager.getRepository(AnamnesisSection);
    const questionRepo = manager.getRepository(AnamnesisQuestion);

    let anyreq = req as any;
    const id = anyreq.params.id;
    const sanitizedId = SqlSanitization(id).includes("anamnesis_form_")
      ? SqlSanitization(id)
      : "anamnesis_form_" + SqlSanitization(id);

    const form = await formRepo.findOne({
      where: { id: sanitizedId },
      select: ["id", "title", "description"],
    });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    const formTemplate = {
      ...form,
      sections: [],
    };

    const sections = await sectionRepo.find({
      where: { form_id: sanitizedId },
      order: { order: "ASC" },
      select: ["id", "title", "description", "order"],
    });

    formTemplate.sections = await Promise.all(
      sections.map(async (section) => {
        const questions = await questionRepo.find({
          where: { section_id: section.id },
          order: { created_at: "ASC" },
          select: ["id", "question_text", "question_type", "options"],
        });

        return {
          ...section,
          questions,
        };
      })
    );

    return res.json({ success: true, form: formTemplate });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
