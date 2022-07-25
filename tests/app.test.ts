import app from '../app.js';
import supertest from 'supertest';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import * as factory from './factories/authFactory.js'
import prisma from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

describe("Tests", () => {

    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE users,tests;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("creating a user it should return 201", async () => {
        const body = await factory.generateUser();
        const response = await supertest(app).post("/sign-up").send(body);

        expect(response.status).toEqual(201);
    });

    it("creating a user with an used email it should return 409", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        const response = await supertest(app).post("/sign-up").send(body);

        expect(response.status).toEqual(409);
    });

    it("creating a user without an email it should return 422", async () => {
        const body = await factory.generateUser();
        delete body.email;
        await supertest(app).post("/sign-up").send(body);
        const response = await supertest(app).post("/sign-up").send(body);
        
        expect(response.status).toEqual(422);
    });

    it("creating a user without an password it should return 422", async () => {
        const body = await factory.generateUser();
        delete body.password;
        await supertest(app).post("/sign-up").send(body);
        const response = await supertest(app).post("/sign-up").send(body);

        expect(response.status).toEqual(422);
    });

    it("make login with a registered a user it should return a token", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const token = jwt.sign(body.email, process.env.JWT_SECRET);
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        expect(tokenReceived.text).toBe(token);
    });

    it("make login with a wrong password it should return a 401", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);

        delete body.confirmedPassword;

        const body2 = await factory.generateUser();
        body.password=body2.password;

        const response = await supertest(app).post("/sign-in").send(body);

        expect(response.status).toBe(401);
    });

    it("make login with a unregistered email it should return a 404", async () => {
        const body = await factory.generateUser();
        delete body.confirmedPassword;
        const response = await supertest(app).post("/sign-in").send(body);

        expect(response.status).toBe(404);
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

    it("post a test without name it should return 422", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const {id:categoryId} = await prisma.category.findFirst()
        const teacherDiscipline = await prisma.teacherDiscipline.findFirst()
        const {id:teacherId} = await prisma.teacher.findUnique({where:{id:teacherDiscipline.teacherId}})
        const {id:disciplineId} = await prisma.discipline.findUnique({where:{id:teacherDiscipline.disciplineId}})
        
        const testBody = await factory.generateTest();
        delete testBody.name;
        const testData={...testBody, categoryId, teacherId, disciplineId}
        const response = await supertest(app).post("/test").send(testData).set({ 'authorization': `Bearer ${tokenReceived.text}`});

        expect(response.status).toEqual(422);
    });

    it("post a test without pdfUrl it should return 422", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const {id:categoryId} = await prisma.category.findFirst()
        const teacherDiscipline = await prisma.teacherDiscipline.findFirst()
        const {id:teacherId} = await prisma.teacher.findUnique({where:{id:teacherDiscipline.teacherId}})
        const {id:disciplineId} = await prisma.discipline.findUnique({where:{id:teacherDiscipline.disciplineId}})
        
        const testBody = await factory.generateTest();
        delete testBody.pdfUrl;
        const testData={...testBody, categoryId, teacherId, disciplineId}
        const response = await supertest(app).post("/test").send(testData).set({ 'authorization': `Bearer ${tokenReceived.text}`});

        expect(response.status).toEqual(422);
    });

    it("post a test without a valid category it should return 404", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        let {id:categoryId} = await prisma.category.findFirst()
        const teacherDiscipline = await prisma.teacherDiscipline.findFirst()
        const {id:teacherId} = await prisma.teacher.findUnique({where:{id:teacherDiscipline.teacherId}})
        const {id:disciplineId} = await prisma.discipline.findUnique({where:{id:teacherDiscipline.disciplineId}})
        
        categoryId = categoryId-1;

        const testBody = await factory.generateTest();
        const testData={...testBody, categoryId, teacherId, disciplineId}
        const response = await supertest(app).post("/test").send(testData).set({ 'authorization': `Bearer ${tokenReceived.text}`});

        expect(response.status).toEqual(404);
    });

    it("post a test without a valid discipline it should return 404", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const {id:categoryId} = await prisma.category.findFirst()
        const teacherDiscipline = await prisma.teacherDiscipline.findFirst()
        const {id:teacherId} = await prisma.teacher.findUnique({where:{id:teacherDiscipline.teacherId}})
        let {id:disciplineId} = await prisma.discipline.findUnique({where:{id:teacherDiscipline.disciplineId}})
        
        disciplineId--;

        const testBody = await factory.generateTest();
        const testData={...testBody, categoryId, teacherId, disciplineId}
        const response = await supertest(app).post("/test").send(testData).set({ 'authorization': `Bearer ${tokenReceived.text}`});

        expect(response.status).toEqual(404);
    });

    it("post a test without a valid teacher it should return 404", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const {id:categoryId} = await prisma.category.findFirst()
        const teacherDiscipline = await prisma.teacherDiscipline.findFirst()
        let {id:teacherId} = await prisma.teacher.findUnique({where:{id:teacherDiscipline.teacherId}})
        const {id:disciplineId} = await prisma.discipline.findUnique({where:{id:teacherDiscipline.disciplineId}})
        
        teacherId--;

        const testBody = await factory.generateTest();
        const testData={...testBody, categoryId, teacherId, disciplineId}
        const response = await supertest(app).post("/test").send(testData).set({ 'authorization': `Bearer ${tokenReceived.text}`});

        expect(response.status).toEqual(404);
    });

    it("post a test with a invalid token it should return 401", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const {id:categoryId} = await prisma.category.findFirst()
        const teacherDiscipline = await prisma.teacherDiscipline.findFirst()
        const {id:teacherId} = await prisma.teacher.findUnique({where:{id:teacherDiscipline.teacherId}})
        const {id:disciplineId} = await prisma.discipline.findUnique({where:{id:teacherDiscipline.disciplineId}})
        
        const testBody = await factory.generateTest();
        delete testBody.pdfUrl;
        const testData={...testBody, categoryId, teacherId, disciplineId}
        const response = await supertest(app).post("/test").send(testData).set({ 'authorization': `Bearer a${tokenReceived.text}`});

        expect(response.status).toEqual(401);
    });

    it("get all tests grouped by teacher it should return a object", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const response = await supertest(app).get("/test/teacher").set({ 'authorization': `Bearer ${tokenReceived.text}`});

        expect(response.text).not.toBeNull();
    });

    it("get all tests grouped by teacher with a invalid token it should return a 401", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const response = await supertest(app).get("/test/teacher").set({ 'authorization': `Bearer a${tokenReceived.text}`});

        expect(response.status).toBe(401);
    });

    it("get all tests grouped by discipline it should return a object", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const response = await supertest(app).get("/test/discipline").set({ 'authorization': `Bearer ${tokenReceived.text}`});

        expect(response.text).not.toBeNull();
    });

    it("get all tests grouped by discipline with invalid token it should return a 401", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const tokenReceived = await supertest(app).post("/sign-in").send(body);

        const response = await supertest(app).get("/test/discipline").set({ 'authorization': `Bearer a${tokenReceived.text}`});

        expect(response.status).toBe(401);
    });
});