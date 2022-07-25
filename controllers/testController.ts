import { Request, Response } from "express";
import * as testService from '../services/testService.js';

export async function postTest(req:Request, res:Response) {
    const {name, pdfUrl, teacherId, disciplineId, categoryId} = req.body;
    const data={name, pdfUrl, teacherId, disciplineId, categoryId};
    await testService.insertTest(data);
    res.sendStatus(201)
}

export async function getTestsByTeacher(req:Request, res:Response) {
    const testsByTeacher = await testService.findTestByTeacher()
    res.send(testsByTeacher)
}