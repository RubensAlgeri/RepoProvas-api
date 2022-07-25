import app from '../app.js';
import supertest from 'supertest';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authFactory from './factories/authFactory.js';
import prisma from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users,tests;`;
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe("Auth router tests", () => {

    it("creating a user it should return 201", async () => {
        const body = await authFactory.generateUser();
        await supertest(app).post("/sign-up").send(body);

        const user = await prisma.user.findUnique({where:{email:body.email}})
        
        expect(bcrypt.compareSync(body.password, user.password)).toEqual(true);
    });

    it("creating a user with an used email it should return 409", async () => {
        const body = await authFactory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        await supertest(app).post("/sign-up").send(body);

        const user = await prisma.user.findMany({where:{email:body.email}})

        expect(user.length).toEqual(1);
    });

    it("creating a user without an email it should return 422", async () => {
        const body = await authFactory.generateUser();
        delete body.email;
        await supertest(app).post("/sign-up").send(body);
        const user = await prisma.user.findMany({where:{email:body.email}})

        expect(user.length).toEqual(0);
    });

    it("creating a user without an password it should return 422", async () => {
        const body = await authFactory.generateUser();
        delete body.password;
        await supertest(app).post("/sign-up").send(body);
        await supertest(app).post("/sign-up").send(body);
        const user = await prisma.user.findMany({where:{email:body.email}})

        expect(user.length).toEqual(0);
    });

    it("make login with a registered a user it should return a token", async () => {
        const body = await authFactory.generateUser();
        await supertest(app).post("/sign-up").send(body);
        delete body.confirmedPassword;
        const token = jwt.sign(body.email, process.env.JWT_SECRET);
        const response = await supertest(app).post("/sign-in").send(body);

        expect(response.text).toBe(token);
    });

    it("make login with a wrong password it should return a 401", async () => {
        const body = await authFactory.generateUser();
        await supertest(app).post("/sign-up").send(body);

        delete body.confirmedPassword;

        const body2 = await authFactory.generateUser();
        body.password=body2.password;

        const token = jwt.sign(body.email, process.env.JWT_SECRET);
        const response = await supertest(app).post("/sign-in").send(body);

        expect(response.text).not.toBe(token);
    });

    it("make login with a unregistered email it should return a 404", async () => {
        const body = await authFactory.generateUser();
        delete body.confirmedPassword;
        const token = jwt.sign(body.email, process.env.JWT_SECRET);
        const response = await supertest(app).post("/sign-in").send(body);

        expect(response.text).not.toBe(token);
    });
});