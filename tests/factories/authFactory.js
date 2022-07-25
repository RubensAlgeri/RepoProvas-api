import { faker } from "@faker-js/faker";

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

export async function generateTest(){
    const name = faker.random.words();
    const pdfUrl = faker.internet.url();
    const test = {
        name,
        pdfUrl,
    }
    return test;
}