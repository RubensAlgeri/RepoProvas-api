import app from '../../app.js';
import { faker } from "@faker-js/faker";
import supertest from 'supertest';

export async function generateUser(){
    const password = faker.internet.password(6);
    const email = faker.internet.email();
    const user = {
        email,
        password,
        confirmedPassword: password,
    }
    return user;
}

export async function singInUser(){
    const password = faker.internet.password(6);
    const body ={
        email:faker.internet.email(),
        password,
        confirmedPassword:password
    }
    await supertest(app).post("/sign-up").send(body);
    delete body.confirmedPassword;
    const response = await supertest(app).post("/sign-in").send(body);
    
    return response.text;
}