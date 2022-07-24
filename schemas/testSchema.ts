import joi from "joi";

export const testSchema = joi.object({
    name: joi.string().required(),
    pdfUrl: joi.string().uri().required(),
    categoryId: joi.number().strict().required(),
    disciplineId: joi.number().strict().required(),
    teacherId: joi.number().strict().required(),
});