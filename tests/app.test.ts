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
        const response = await supertest(app).post("/signup").send(body);
        expect(response.status).toEqual(201);

    });

    it("login with a registered a user it should return a token", async () => {
        const body = await factory.generateUser();
        await supertest(app).post("/signup").send(body);
        delete body.confirmedPassword;
        const token = jwt.sign(body.email, process.env.JWT_SECRET);
        const tokenReceived = await supertest(app).post("/signin").send(body);
        expect(tokenReceived.text).toBe(token);
    
    });
});
