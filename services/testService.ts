import * as testRepository from "../repositories/testRepository.js";
import { Test } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();

export type CreateTestData = Omit<Test,'id'>;

export async function insertTest(data) {
    const {teacherId, disciplineId, categoryId} = data;

    const checkCategory = await testRepository.checkCategory(categoryId)
    if(!checkCategory)throw{type:404,message:"Category is not registered"}

    const checkTeacher = await testRepository.checkTeacher(teacherId)
    if(!checkTeacher)throw{type:404,message:"Teacher is not registered"}

    const checkDiscipline = await testRepository.checkDiscipline(disciplineId)
    if(!checkDiscipline)throw{type:404,message:"Discipline is not registered"}

    const check = await testRepository.checkTeacherDiscipline(teacherId,disciplineId)
    if(!check)throw{type:404,message:"This teacher doesn't teach this discipline"}

    delete data.teacherId;
    delete data.disciplineId;
    data.teacherDisciplineId = check.id;

    await testRepository.insertTest(data)
}

export async function findTestByTeacher() {
    const testsByTeacher = await testRepository.findTestByTeacher()
    return testsByTeacher;
}

export async function findTestByDiscipline() {
    const testsByDiscipline = await testRepository.findTestByDiscipline()
    return testsByDiscipline;
}