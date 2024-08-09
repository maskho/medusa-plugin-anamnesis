import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { AnamnesisForm } from "../../../../models/anamnesis_form";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const formRepo = manager.getRepository("AnamnesisForm");

    return res.json({ success: true, forms: await formRepo.find() });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const formRepo = manager.getRepository(AnamnesisForm);

    let anyreq = req as any;
    let form = { ...anyreq.body };

    const newForm = formRepo.create(form);

    await formRepo.save(newForm);

    return res.json({ success: true, form: { ...newForm } });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
