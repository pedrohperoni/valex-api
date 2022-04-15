import * as companyRepository from "../repositories/companyRepository.js";

export async function validateAPIKey(apiKey: string) {
   const company = await companyRepository.findByApiKey(apiKey);
   if (!company) throw {type: "bad_request", message: "Company not found"}

  return company;
}
