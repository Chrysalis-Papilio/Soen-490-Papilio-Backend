//     "test": "jest --reporters default jest-stare --coverage --detectOpenHandles --runInBand --testTimeout=60000"
import request from 'supertest';
import app from '../../../app';

describe("GET /user", () => {
    /** Testing getAllUsers endpoint */
    it("responds with an array of users.", async () => {
        //  Arrange
        const endpoint = '/api/user/getAllUsers';
        const expectedStatusCode = 200;

        //  Act
        const res = await request(app)
        .get(endpoint);
        
        //  Assert
        expect(res.statusCode).toBe(expectedStatusCode);
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('firstName');
        expect(res.body[0]).toHaveProperty('lastName');
        expect(res.body[0]).toHaveProperty('countryCode');
        expect(res.body[0]).toHaveProperty('phone');
        expect(res.body[0]).toHaveProperty('email');
        expect(res.body[0]).toHaveProperty('createdAt');
        expect(res.body[0]).toHaveProperty('updatedAt');
    });

    /** Testing getUserByEmail endpoint */
    it("gets a user using an email.", async () => {
        //  Arrange
        const endpoint = '/api/user/getUserByEmail';
        const testEmail = 'sample2@gmail.com';
        const expectedStatusCode = 200;

        //  Act
        const res = await request(app)
        .get(endpoint)
        .send({
            email: testEmail
        });

        //  Assert
        expect(res.statusCode).toBe(expectedStatusCode);
      });
});

/** Testing POST endpoints. */
describe("POST /user", () => {

    it("creates a simple user.", async () => {
        //  Arrange
        const endpoint = '/api/user/createSimpleUser'
        const firstname = 'Mike2';
        const lastname = 'LP2';
        const email = 'mikelaplaine2@gmail.com';
        const countryCode = '12';
        const phone = '5147175552';
        const firebase_id = '2';
        const expectedStatusCode = 409;

        //  Act
        const res = await request(app)
        .post(endpoint)
        .send({
            firstName: firstname,
            lastName: lastname,
            email: email,
            countryCode: countryCode,
            phone: phone,
            firebase_id: firebase_id
        });

        //  Assert
        expect(res.statusCode).toBe(expectedStatusCode);
    });
    test("Updates a user profile given a firstname, lastname, email or firebase_id.", async () => {
        //  Act
        const endpoint = '/api/user/updateUserProfile'
        const fields = 'email'
        const firstname = 'Maxi';
        const phone = '61461561634';
        const countryCode = "2";
        const email = 'sample2@gmail.com';
        const expectedStatusCode = 400;

        //  Arrange
        const res = await request(app)
        .post(endpoint)
        .send({
            fields: [fields],
            user: {
                firstName: firstname,
                phone: phone,
                countryCode: countryCode,
                email: email
            }
        });

        //  Assert
        expect(res.statusCode).toBe(expectedStatusCode);
    });
});