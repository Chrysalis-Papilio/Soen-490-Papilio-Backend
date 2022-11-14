import request from 'supertest';
import app from '../../../app';
import { userRepos } from '../../repos';

describe("UserController", () => {
    describe("GET /user", () => {
        describe('getAllUsers endpoint', () => {
            it("returns an non-empty array of users.", async () => {
                //  Arrange
                const endpoint = '/api/user/getAllUsers';
                const expectedStatusCode = 200;
                const userRepoSpy = jest
                .spyOn(userRepos, 'getAllUsers')
                .mockResolvedValueOnce([{
                    firstName: 'Test',
                    lastName: 'User',
                    phone: '5141234567',
                    email: 'test@gmail.com',
                    firebase_id: 'testID',
                    countryCode: 1,
                    id: 1
                }]);

                //  Act
                const res = await request(app).get(endpoint);
                
                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(userRepoSpy).toHaveBeenCalledWith();
                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(res.body[0]).toHaveProperty('id');
                expect(res.body[0]).toHaveProperty('firstName');
                expect(res.body[0]).toHaveProperty('lastName');
                expect(res.body[0]).toHaveProperty('countryCode');
                expect(res.body[0]).toHaveProperty('phone');
                expect(res.body[0]).toHaveProperty('email');
                userRepoSpy.mockRestore();
            });

            it('should return an empty array.', async() => {
                //  Arrange
                const endpoint = '/api/user/getAllUsers';
                const expectedStatusCode = 200;
                const userRepoSpy = jest
                .spyOn(userRepos, 'getAllUsers')
                .mockResolvedValueOnce([]); 

                //  Act
                const res = await request(app).get(endpoint)

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body).toEqual([]);
                expect(userRepoSpy).toHaveBeenCalledWith();
                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                userRepoSpy.mockRestore();
            });
        });
        describe('getUserByEmail endpoint', () => {
            it("should return the correct user.", async () => {
                //  Arrange
                const endpoint = '/api/user/getUserByEmail';
                const testEmail = 'sample2@gmail.com';
                const expectedStatusCode = 200;
                const userRepoSpy = jest
                .spyOn(userRepos, 'getUserByEmail')
                .mockResolvedValueOnce({
                    id: 1,
                    firebase_id: '1fnj3u4hsd',
                    firstName: 'Lenny',
                    lastName: 'Jenkins-Joules',
                    email: 'sample2@gmail.com',
                    phone: '6146156164',
                    countryCode: 1,
            });

                //  Act
                const res = await request(app)
                .get(endpoint)
                .send({
                    email: testEmail
                });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(testEmail);
                expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
                expect(res.body.id).toEqual(1);
                expect(res.body.firebase_id).toEqual('1fnj3u4hsd');
                expect(res.body.firstName).toEqual('Lenny');
                expect(res.body.lastName).toEqual('Jenkins-Joules');
                expect(res.body.email).toEqual('sample2@gmail.com');
                expect(res.body.phone).toEqual('6146156164');
                expect(res.body.countryCode).toEqual(1);
                userRepoSpy.mockRestore();
            });

            it("should return an empty JSON object.", async () => {
                //  Arrange
                const endpoint = '/api/user/getUserByEmail';
                const testEmail = 'invalidEmail';
                const expectedStatusCode = 200;
                const userRepoSpy = jest
                .spyOn(userRepos, 'getUserByEmail')
                .mockResolvedValueOnce({} as any);

                //  Act
                const res = await request(app)
                .get(endpoint)
                .send({
                    email: testEmail
                });
                console.log(res.body, 'resing');
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(testEmail);
                expect(res.body).toEqual({});
                userRepoSpy.mockRestore();
            });
            it("should return a BADREQUEST[400] status code.", async () => {
                //  Arrange
                const endpoint = '/api/user/getUserByEmail';
                const expectedStatusCode = 400;
                const userRepoSpy = jest
                .spyOn(userRepos, 'getUserByEmail')
                .mockResolvedValueOnce({} as any);
                
                //  Act
                const res = await request(app)
                .get(endpoint)
                .send({});

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(res.body).toEqual({})
                expect(userRepoSpy).toHaveBeenCalledTimes(0);
                userRepoSpy.mockRestore();
            });
        });
    });

    /** Testing POST endpoints. */
    describe("POST /user", () => {
        describe('createSimpleUser endpoint', () => {
            it("should return a BADREQUEST[400] status code.", async () => {
                //  Arrange
                const endpoint = '/api/user/createSimpleUser'
                const expectedStatusCode = 400;
                const userRepoSpy = jest
                .spyOn(userRepos, 'createSimpleUser')
                .mockResolvedValue({} as any);
                const user = {
                    id: 1,
                    firebase_id: '1fnj3u4hsd',
                    firstName: 'Lenny',
                    lastName: 'Jenkins-Joules',
                    email: 'sample2@gmail.com',
                    phone: '6146156164',
                    countryCode: 1,
                }

                //  Act
                const res = await request(app)
                .post(endpoint)
                .send(user);

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(userRepoSpy).toHaveBeenCalledTimes(0);
                userRepoSpy.mockRestore();
            });
            it("should return a NOTFOUND[404] status code.", async () => {
                //  Arrange
                const endpoint = '/api/user/createSimpleUse'
                const expectedStatusCode = 404;
                const userRepoSpy = jest
                .spyOn(userRepos, 'createSimpleUser')
                .mockResolvedValue({} as any)
                const user = {
                    id: 1,
                    firebase_id: '1fnj3u4hsd',
                    firstName: 'Lenny',
                    lastName: 'Jenkins-Joules',
                    email: 'sample2@gmail.com',
                    phone: '6146156164',
                    countryCode: 1,
                }

                //  Act
                const res = await request(app)
                .post(endpoint)
                .send(user);

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(userRepoSpy).not.toHaveBeenCalled();
                userRepoSpy.mockRestore();
            });
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
});