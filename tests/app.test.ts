import app from '../app.js';
import supertest from 'supertest';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import * as factory from './factories/authFactory.js'
import prisma from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

describe("POST /signup", () => {

    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE users;`;
    });

    it("creating a user it should return 201", async () => {
        const body = await factory.generateUser();
        const response = await supertest(app).post("/sign-up").send(body);
        expect(response.status).toEqual(201);

    });

    it("login with a registered a user it should return a token", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const token = jwt.sign(body.email, process.env.JWT_SECRET);
        const tokenReceived = await supertest(app).post("/sign-in").send(body);
        expect(tokenReceived.text).toBe(token);
    
    });
    it("post a test it should return 201", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const {id:categoryId} = await prisma.category.findFirst()
        const teacherDiscipline = await prisma.teacherDiscipline.findFirst()
        const {id:teacherId} = await prisma.teacher.findUnique({where:{id:teacherDiscipline.teacherId}})
        const {id:disciplineId} = await prisma.discipline.findUnique({where:{id:teacherDiscipline.disciplineId}})
        
        const testBody = await factory.generateTest();
        const testData={...testBody, categoryId, teacherId, disciplineId}
        const response = await supertest(app).post("/test").send(testData).set({ 'authorization': `Bearer ${tokenReceived.text}`});
        expect(response.status).toEqual(201);
    });

    it("get all tests grouped by teacher it should return a object", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const response = await supertest(app).get("/test/teacher").set({ 'authorization': `Bearer ${tokenReceived.text}`});
        expect(response.text).not.toBeNull();
    });

    it("get all tests grouped by discipline it should return a object", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const response = await supertest(app).get("/test/discipline").set({ 'authorization': `Bearer ${tokenReceived.text}`});
        expect(response.text).not.toBeNull();
    });
});