import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { getFormsRoute } from "../../../../utils/get_forms_route";
import { EntityManager } from "typeorm";
import { AnamnesisForm } from "../../../../models/anamnesis_form";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  return getFormsRoute(req, res);
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const formRepo = manager.getRepository(AnamnesisForm);

    let anyreq = req as any;
    let form = { ...anyreq.body };

    const newForm = formRepo.create(form);

    await formRepo.save(newForm);

    return res.json({
      success: true,
      form: { ...newForm },
    });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
