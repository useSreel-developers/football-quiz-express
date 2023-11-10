import Joi from "joi";

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().required(),
  avatar: Joi.string(),
});
