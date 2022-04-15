import { NextFunction, Request, Response } from "express";
import * as companyService from "../services/companyService.js";

export default async function apiKeyValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) throw { type: "bad_request", message: "API key is required" };

  const company = await companyService.validateAPIKey(apiKey.toString());
  res.locals.company = company;
  next();
}
