import { NextFunction, Request, Response } from "express";

export function schemaValidationMiddleware(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
      throw { type: "bad_request", message: "Invalid schema"};
    }

    next();
  };
}
