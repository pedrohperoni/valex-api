import joi from "joi";

const cardCreateSchema = joi.object({
   employeeId: joi
    .number()
    .required(),
   cardType: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export default cardCreateSchema;
