import joi from "joi";

const cardRechargeSchema = joi.object({
  amount: joi.number().greater(0).max(2147483647).required(),
});

export default cardRechargeSchema;
