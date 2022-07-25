import { faker } from "@faker-js/faker";
import prisma  from "../../config/database.js";

export async function generateTest(){
    const name = faker.random.words();
    const pdfUrl = faker.internet.url();
    const {id:categoryId} = await prisma.category.findFirst()
    const teacherDiscipline = await prisma.teacherDiscipline.findFirst()
    const {id:teacherId} = await prisma.teacher.findUnique({where:{id:teacherDiscipline.teacherId}})
    const {id:disciplineId} = await prisma.discipline.findUnique({where:{id:teacherDiscipline.disciplineId}})

    const test = {
        name,
        pdfUrl,
        categoryId,
        teacherId,
        disciplineId
    }
    return test;
}