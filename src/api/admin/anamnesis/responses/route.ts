import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const responseRepo = manager.getRepository("AnamnesisResponse");

    return res.json({ success: true, responses: await responseRepo.find() });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};
