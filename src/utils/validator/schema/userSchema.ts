import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().required(),
  avatar: Joi.string(),
});
