import prisma from "../config/database.js";
import { CreateTestData } from "../services/testService.js";

export function checkCategory(categoryId:number) {
    return prisma.category.findFirst({where:{id:categoryId}})
}

export function checkTeacher(teacherId:number) {
    return prisma.teacher.findFirst({where:{id:teacherId}})
}

export function checkDiscipline(disciplineId:number) {
    return prisma.discipline.findFirst({where:{id:disciplineId}})
}

export function checkTeacherDiscipline(teacherId:number, disciplineId:number) {
    return prisma.teacherDiscipline.findFirst({where:{teacherId, disciplineId}})
}

export function insertTest(data:CreateTestData) {
    return prisma.test.create({data})
}

export function checkToken(id:number) {
    return prisma.user.findUnique({where:{id}})
}

export function findTestByTeacher() {
    
    return prisma.teacher.findMany({
                select:{
                    name:true,
                    teacherDisciplines:{
                        select:{
                            discipline:{
                                select:{
                                    term:{}
                                }
                            },
                            tests:{
                                include:{
                                    category:{},
                                }
                            }
                        }
                    }
            },
    })
}