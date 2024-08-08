import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

export const getFormsRoute = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const formRepo = manager.getRepository("AnamnesisForm");

    return res.json({
      forms: await formRepo.find(),
    });
  } catch (e) {
    return res.json({
      error: e.toString(),
      error_obj: e,
    });
  }
};
