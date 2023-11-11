import Joi from "joi";

export const googleAuthSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  emailVerified: Joi.boolean().required(),
});
