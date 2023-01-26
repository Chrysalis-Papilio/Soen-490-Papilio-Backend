import request from 'supertest';
import app, { server } from '../../../app';
import { User, Activity } from '../../models';

describe('UserController', () => {
    beforeEach(() => {
        // @ts-expect-error
        jest.spyOn(User, 'sync').mockResolvedValue(null);
        // @ts-expect-error
        jest.spyOn(Activity, 'sync').mockResolvedValue(null);
    });

    afterEach(() => {
        server.close();
    });

    describe('GET /user', () => {
        describe('getAllUsers endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('returns an non-empty array of users.', async () => {
                //  Arrange
                const endpoint = '/api/user/getAllUsers';
                const expectedStatusCode = 200;

                const mockUser = jest.spyOn(User, 'findAll').mockResolvedValueOnce([
                    {
                        // @ts-expect-error
                        firstName: 'Test',
                        lastName: 'User',
                        phone: '5141234567',
                        email: 'test@gmail.com',
                        firebase_id: 'testID',
                        countryCode: 1,
                        bio: '',
                        id: 1
                    }
                ]);

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(mockUser).toHaveBeenCalled();
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(res.body[0]).toHaveProperty('id');
                expect(res.body[0]).toHaveProperty('firstName');
                expect(res.body[0]).toHaveProperty('lastName');
                expect(res.body[0]).toHaveProperty('countryCode');
                expect(res.body[0]).toHaveProperty('phone');
                expect(res.body[0]).toHaveProperty('email');
                mockUser.mockRestore();
            });

            it('should return an empty array.', async () => {
                //  Arrange
                const endpoint = '/api/user/getAllUsers';
                const expectedStatusCode = 200;
                const mockUser = jest.spyOn(User, 'findAll').mockResolvedValueOnce([]);

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body).toEqual([]);
                expect(mockUser).toHaveBeenCalled();
                expect(mockUser).toHaveBeenCalledTimes(1);
                mockUser.mockRestore();
            });
        });
        describe('getUserByEmail endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return the correct user.', async () => {
                //  Arrange
                const testEmail = 'sample2@gmail.com';
                const endpoint = `/api/user/getUserByEmail/${testEmail}`;
                const expectedStatusCode = 200;
                const mockUser = jest.spyOn(User, 'findOne').mockResolvedValueOnce({
                    //  @ts-expect-error
                    firebase_id: '1fnj3u4hsd',
                    firstName: 'Lenny',
                    lastName: 'Jenkins-Joules',
                    email: 'sample2@gmail.com',
                    phone: '6146156164',
                    countryCode: 1
                });

                //  Act
                const res = await request(app).get(endpoint).send({
                    email: testEmail
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(mockUser).toHaveBeenCalledTimes(1);
                expect(mockUser).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: { email: testEmail }
                    })
                );
                expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
                expect(res.body.found).toEqual(true);
                expect(res.body.user.firebase_id).toEqual('1fnj3u4hsd');
                expect(res.body.user.firstName).toEqual('Lenny');
                expect(res.body.user.lastName).toEqual('Jenkins-Joules');
                expect(res.body.user.email).toEqual('sample2@gmail.com');
                expect(res.body.user.phone).toEqual('6146156164');
                expect(res.body.user.countryCode).toEqual(1);
                mockUser.mockRestore();
            });

            it('should return a BADREQUEST[400] status code.', async () => {
                //  Arrange
                const testEmail = 'invalidEmail';
                const endpoint = `/api/user/getUserByEmail/${testEmail}`;
                const expectedStatusCode = 400;
                const mockUser = jest.spyOn(User, 'findOne').mockResolvedValueOnce({
                    //  @ts-expect-error
                    firebase_id: '1fnj3u4hsd',
                    firstName: 'Lenny',
                    lastName: 'Jenkins-Joules',
                    email: 'sample2@gmail.com',
                    phone: '6146156164',
                    countryCode: 1
                });

                //  Act
                const res = await request(app).get(endpoint).send({
                    email: testEmail
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(mockUser).not.toHaveBeenCalled();
                expect(res.body).toEqual({});
                mockUser.mockRestore();
            });
        });
    });

    /** Testing POST endpoints. */
    describe('POST /user', () => {
        describe('createUser endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return a BADREQUEST[400] status code.', async () => {
                //  Arrange
                const endpoint = '/api/user/createUser';
                const expectedStatusCode = 400;
                // const userRepoSpy = jest.spyOn(userRepo, 'createUser').mockResolvedValue(resultValue);
                const mockFindOne = jest.spyOn(User, 'findOne').mockResolvedValueOnce({
                    //  @ts-expect-error
                    firebase_id: '1fnj3u4hsd',
                    firstName: 'Lenny',
                    lastName: 'Jenkins-Joules',
                    email: 'sample2@gmail.com',
                    phone: '6146156164',
                    countryCode: 1
                });
                const user = {
                    id: 1,
                    //  missing firebase_id: '1fnj3u4hsd',
                    firstName: 'Lenny',
                    lastName: 'Jenkins-Joules',
                    email: 'sample2@gmail.com',
                    phone: '6146156164',
                    countryCode: 1
                };

                //  Act
                const res = await request(app).post(endpoint).send(user);

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(mockFindOne).toHaveBeenCalledTimes(0);
                mockFindOne.mockRestore();
            });
        });
        it('Updates a user profile and returns the user object.', async () => {
            //  Act
            const endpoint = '/api/user/updateUserProfile';
            const firebase_id = 'uf4938jvkuelb238210gaswsd';
            const firstname = 'Bob';
            const lastName = 'Smith';
            const phone = '5140006868';
            const countryCode = 1;
            const email = 'bsmith@test.com';
            const expectedStatusCode = 200;
            const user = {
                firebase_id: firebase_id,
                firstName: firstname,
                lastName: lastName,
                email: email,
                phone: phone,
                countryCode: countryCode,
                bio: 'my bio'
            };
            // @ts-expect-error
            const mockUpdate = jest.spyOn(User, 'update').mockResolvedValueOnce([1, [user]]);

            //  Arrange
            const res = await request(app)
                .put(endpoint)
                .send({
                    identifier: {
                        firebase_id: user.firebase_id
                    },
                    update: {
                        phone: user.phone
                    }
                });

            //  Assert
            expect(res.statusCode).toEqual(expectedStatusCode);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
            expect(res.body.success).toEqual(true);
            expect(res.body.update.firebase_id).toEqual(firebase_id);
            expect(res.body.update.firstName).toEqual(firstname);
            expect(res.body.update.lastName).toEqual(lastName);
            expect(res.body.update.email).toEqual(email);
            expect(res.body.update.phone).toEqual(phone);
            expect(res.body.update.countryCode).toEqual(countryCode);
            mockUpdate.mockRestore();
        });
    });
});
