import Joi from "joi";

export const winningDiamondSchema = Joi.object({
  diamond: Joi.number().required(),
});
