import joi from "joi";

const purchaseSchema = joi.object({
  amount: joi.number().greater(0).max(2147483647).required(),
  businessId: joi.number().required(),
  cardId: joi.number().required(),
  password: joi.string().pattern(/^[0-9]{4}$/).required()
});

export default purchaseSchema;
