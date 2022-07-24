import joi from "joi";

export const signupUserSchema = joi.object({
    email: joi.string().email({ tlds: { allow: false } }).required(),
    password: joi.string().min(6).required(),
    confirmedPassword: joi.string().min(6).valid(joi.ref('password')).required()
});

export const signinUserSchema = joi.object({
    email: joi.string().email({ tlds: { allow: false } }).required(),
    password: joi.string().min(6).required(),
});