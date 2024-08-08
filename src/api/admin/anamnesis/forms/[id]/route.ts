import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AnamnesisForm } from "../../../../../models/anamnesis_form";
import { SqlSanitization } from "../../../../../utils/sql_sanitization";
import { EntityManager } from "typeorm";
import { AnamnesisSection } from "../../../../../models/anamnesis_section";
import { AnamnesisQuestion } from "../../../../../models/anamnesis_question";

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

    const form = await formRepo.findOneBy({ id: sanitizedId });

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
    });

    formTemplate.sections = await Promise.all(
      sections.map(async (section) => {
        const questions = await questionRepo.find({
          where: { section_id: section.id },
          order: { created_at: "ASC" },
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

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const formRepo = manager.getRepository(AnamnesisForm);

    let anyreq = req as any;
    const id = anyreq.params.id;
    const sanitizedId = SqlSanitization(id).includes("anamnesis_form_")
      ? SqlSanitization(id)
      : "anamnesis_form_" + SqlSanitization(id);

    const exists = await formRepo.exist({ where: { id: sanitizedId } });

    if (!exists) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    await formRepo.delete({ id: sanitizedId });

    return res.json({ success: true });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
