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