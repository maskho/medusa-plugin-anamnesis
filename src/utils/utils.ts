export const createPathRequest = (
  formId,
  base_path = "/admin/anamnesis/forms"
) => (formId ? base_path + "/" + formId : base_path);
