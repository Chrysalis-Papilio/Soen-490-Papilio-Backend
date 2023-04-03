import request from 'supertest';
import app, { server } from '../../../app';
import { APIError } from '../../../errors/api-error';
import { httpStatusCode } from '../../../types/httpStatusCodes';
import { userRepo } from '../../repos';

jest.mock('sequelize');
jest.mock('../../services/user-services');

/**
 * Get
 *  - getAllusers
 *  - getUserById
 *  - getUserByEmail
 *  - getUserActivityList
 * PUT
 *  - updateUser
 * POST
 *  - createUser
 *  - addNewUserActivity
 */

describe('UserController', () => {
    afterAll(() => {
        server.close();
    });
    let emptyResultValue: any = null;
    const activity = {
        title: 'title',
        description: 'description',
        address: 'address',
        startTime: '04 October 2011 14:48 UTC',
        costPerIndividual: 5,
        costPerGroup: 100,
        groupSize: 10,
        endTime: '05 October 2011 14:48 UTC'
    };
    const user = {
        firebase_id: 'uf4938jvkuelb238210gaswsd',
        firstName: 'John',
        lastName: 'Doe',
        phone: '5140006868',
        countryCode: '1',
        email: 'mikediditididnotdoit@gmail.com',
        bio: 'My bio'
    };
    /////////////////////////
    //                     //
    //    GET ENDPOINTS    //
    //                     //
    /////////////////////////

    describe('GET /user', () => {
        ///////////////////////////////
        //    GETALLUSERS EDNPOINT   //
        ///////////////////////////////
        describe('getAllUsers endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and all users if found.', async () => {
                //  Arrange
                const endpoint = '/api/user/getAllUsers';
                const expectedStatusCode = 200;

                const secondUser = user;

                const userRepoSpy = jest.spyOn(userRepo, 'getAllUsers').mockResolvedValueOnce([user as any, secondUser as any]);

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);

                expect(res.body).toHaveLength(2);

                expect(userRepoSpy).toHaveBeenCalledWith();
                expect(userRepoSpy).toHaveBeenCalledTimes(1);

                userRepoSpy.mockRestore();
            });
            it('should return OK[200] and an empty array if no users found.', async () => {
                //  Arrange
                const endpoint = '/api/user/getAllUsers';
                const expectedStatusCode = 200;

                const userRepoSpy = jest.spyOn(userRepo, 'getAllUsers').mockResolvedValueOnce([]);

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);

                expect(res.body).toEqual([]);

                expect(userRepoSpy).toHaveBeenCalledWith();
                expect(userRepoSpy).toHaveBeenCalledTimes(1);

                userRepoSpy.mockRestore();
            });
            it('should throw an error if exception thrown while fetching from DB.', async () => {
                //  Arrange
                const endpoint = '/api/user/getAllUsers';
                const expectedStatusCode = 500;

                const userRepoSpy = jest.spyOn(userRepo, 'getAllUsers').mockImplementation(() => {
                    throw new Error('DB error');
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);

                expect(userRepoSpy).toHaveBeenCalledWith();
                expect(userRepoSpy).toHaveBeenCalledTimes(1);

                userRepoSpy.mockRestore();
            });
        });
        ///////////////////////////////
        //    GETUSERBYID EDNPOINT   //
        ///////////////////////////////
        describe('getUserByID endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and and a valid user if user found.', async () => {
                //  Arrange
                const endpoint = `/api/user/get/${user.firebase_id}`;
                const expectedStatusCode = 200;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserById').mockResolvedValueOnce({
                    found: true,
                    //@ts-expect-error
                    user: user
                });

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);

                expect(response.body.found).toEqual(true);
                expect(response.body.user.firebase_id).toEqual('uf4938jvkuelb238210gaswsd');

                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(user.firebase_id);

                userRepoSpy.mockRestore();
            });
            it('should return OK[200] and not found if user not found.', async () => {
                //  Arrange
                const badID = 'bad ID';

                const endpoint = `/api/user/get/${badID}`;
                const expectedStatusCode = 200;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserById').mockResolvedValueOnce({
                    found: false,
                    user: null
                });

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);

                expect(response.body.found).toEqual(false);
                expect(response.body.user).toEqual(null);

                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(badID);

                userRepoSpy.mockRestore();
            });
            it('should return NOTFOUND[404] and user not found if passed ID is empty string.', async () => {
                //  Arrange
                const emptyString = '';
                const endpoint = `/api/user/get/${emptyString}`;
                const expectedStatusCode = 404;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserById').mockResolvedValueOnce(emptyResultValue);
                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);

                expect(response.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
            it('should return NOTFOUND[404] if passed parameters is missing id tag.', async () => {
                //  Arrange
                const endpoint = `/api/user/get/`; //  Missing ID tag (:id)
                const expectedStatusCode = 404;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserById').mockResolvedValueOnce(emptyResultValue);
                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);

                expect(response.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
        });
        ///////////////////////////////
        //  GETUSERBYEMAIL EDNPOINT  //
        ///////////////////////////////
        describe('getUserByEmail endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and the user if email is found.', async () => {
                //  Arrange
                const endpoint = `/api/user/getUserByEmail/${user.email}`;
                const expectedStatusCode = 200;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserByEmail').mockResolvedValueOnce({
                    found: true,
                    //@ts-expect-error
                    user: user
                });

                //  Act
                const res = await request(app).get(endpoint).send({
                    email: user.email
                });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body.found).toEqual(true);
                expect(res.body.user.firebase_id).toEqual(user.firebase_id);

                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(user.email);

                userRepoSpy.mockRestore();
            });
            it('should return OK[200] and the user if email is not found.', async () => {
                //  Arrange
                const endpoint = `/api/user/getUserByEmail/${user.email}`;
                const expectedStatusCode = 200;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserByEmail').mockResolvedValueOnce({
                    found: false,
                    user: null
                });

                //  Act
                const res = await request(app).get(endpoint).send({
                    email: user.email
                });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body.found).toEqual(false);
                expect(res.body.user).toEqual(null);

                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(user.email);

                userRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if email is invalid.', async () => {
                //  Arrange
                const invalidEmail = 'invalidEmail';

                const endpoint = `/api/user/getUserByEmail/:email${invalidEmail}`;
                const expectedStatusCode = 400;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserByEmail').mockResolvedValueOnce(emptyResultValue);

                //  Act
                const res = await request(app).get(endpoint);
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
        });
        ////////////////////////////////////////
        //    GETUSERACTIVITYLIST ENDPOINT    //
        ////////////////////////////////////////
        describe('getUserActivityList endpoint', () => {
            afterEach(() => {
                server.close();
            });
            afterAll(() => {
                server.close();
            });
            it('should return OK[200] count if user exists.', async () => {
                //  Arrange
                const endpoint = `/api/user/get/${user.firebase_id}/activities`;
                const expectedStatusCode = 200;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserActivityList').mockResolvedValueOnce({
                    count: 5,
                    //@ts-expect-error
                    activities: activity
                });

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);

                expect(response.body.count).toEqual(5);
                expect(response.body.activities).not.toBeNull();

                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(user.firebase_id);

                userRepoSpy.mockRestore();
            });
            it('should return CONFLICT[409] if user does not exists.', async () => {
                //  Arrange
                const endpoint = `/api/user/get/${user.firebase_id}/activities`;
                const expectedStatusCode = 409;

                const userRepoSpy = jest.spyOn(userRepo, 'getUserActivityList').mockImplementation(() => {
                    throw new APIError(`Cannot find User with firebase_id ${user.firebase_id}`, 'getUserActivityList', httpStatusCode.CONFLICT);
                });

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);

                expect(response.body).toEqual({});

                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(user.firebase_id);

                userRepoSpy.mockRestore();
            });
        });
    });

    /////////////////////////
    //                     //
    //    PUT ENDPOINTS    //
    //                     //
    /////////////////////////
    describe('PUT /user', () => {
        ///////////////////////////////
        //    UPDATEUSER EDNPOINT    //
        ///////////////////////////////
        describe('updateUser endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and update user if valid update is passed.', async () => {
                //  Arrange
                const endpoint = `/api/user/updateUserProfile`;
                const expectedStatusCode = 200;

                const userRepoSpy = jest.spyOn(userRepo, 'updateUser').mockResolvedValueOnce({
                    success: true,
                    //@ts-expect-error
                    update: user
                });

                //  Act
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

                expect(res.body.success).toEqual(true);
                expect(res.body.update.firebase_id).toEqual(user.firebase_id);
                expect(res.body.update.phone).toEqual(user.phone);

                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                userRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if invalid update is passed.', async () => {
                //  Arrange
                const invalidPhone = 'invalidPhone';
                const endpoint = `/api/user/updateUserProfile`;
                const expectedStatusCode = 400;

                const userRepoSpy = jest.spyOn(userRepo, 'updateUser').mockResolvedValueOnce(emptyResultValue);

                //  Act
                const res = await request(app)
                    .put(endpoint)
                    .send({
                        identifier: {
                            firebase_id: user.firebase_id
                        },
                        update: {
                            phone: invalidPhone
                        }
                    });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
            it('should return CONFLICT[409] if user does not exist.', async () => {
                //  Arrange
                const endpoint = `/api/user/updateUserProfile`;
                const expectedStatusCode = 409;

                const userRepoSpy = jest.spyOn(userRepo, 'updateUser').mockImplementation(() => {
                    throw new APIError(`Cannot find User with firebase_id ${user.firebase_id}`, 'addNewUserActivity', httpStatusCode.CONFLICT);
                });

                //  Act
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

                expect(res.body).toEqual({});

                expect(userRepoSpy).toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if request is missing identifier tag.', async () => {
                //  Arrange
                const endpoint = `/api/user/updateUserProfile`;
                const expectedStatusCode = 400;

                const userRepoSpy = jest.spyOn(userRepo, 'updateUser').mockResolvedValueOnce(emptyResultValue);

                //  Act
                const res = await request(app)
                    .put(endpoint)
                    .send({
                        update: {
                            phone: user.phone
                        }
                    });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if request is missing update tag.', async () => {
                //  Arrange
                const endpoint = `/api/user/updateUserProfile`;
                const expectedStatusCode = 400;

                const userRepoSpy = jest.spyOn(userRepo, 'updateUser').mockResolvedValueOnce(emptyResultValue);

                //  Act
                const res = await request(app)
                    .put(endpoint)
                    .send({
                        identifier: {
                            firebase_id: user.firebase_id
                        }
                    });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if passed update field does not match schema.', async () => {
                //  Arrange
                const endpoint = `/api/user/updateUserProfile`;
                const expectedStatusCode = 400;

                const userRepoSpy = jest.spyOn(userRepo, 'updateUser').mockResolvedValueOnce(emptyResultValue);

                //  Act
                const res = await request(app)
                    .put(endpoint)
                    .send({
                        identifier: {
                            firebase_id: user.firebase_id
                        },
                        update: {
                            wrongField: user.phone //  Wrong field
                        }
                    });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
        });
    });

    /////////////////////////
    //                     //
    //    POST ENDPOINTS   //
    //                     //
    /////////////////////////
    describe('POST /user', () => {
        ///////////////////////////////
        //     CREATEUSER EDNPOINT    //
        ///////////////////////////////
        describe('createUser endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] if user already exists.', async () => {
                //  Arrange
                const endpoint = '/api/user/createUser';
                const expectedStatusCode = 200;
                const userRepoSpy = jest.spyOn(userRepo, 'createUser').mockResolvedValueOnce(httpStatusCode.OK);

                //  Act
                const res = await request(app).post(endpoint).send({
                    user: user
                });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(userRepoSpy).toHaveBeenCalled();
                expect(userRepoSpy).toHaveBeenCalledWith(user);
                userRepoSpy.mockRestore();
            });
            it('should return CREATED[201] if user does not exist.', async () => {
                //  Arrange
                const endpoint = '/api/user/createUser';
                const expectedStatusCode = 201;
                const userRepoSpy = jest.spyOn(userRepo, 'createUser').mockResolvedValueOnce(httpStatusCode.CREATED);

                //  Act
                const res = await request(app).post(endpoint).send({
                    user: user
                });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(userRepoSpy).toHaveBeenCalled();
                expect(userRepoSpy).toHaveBeenCalledWith(user);

                userRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if passed parameters are missing core fields.', async () => {
                //  Arrange
                const badUser = {
                    firebase_id: 'uf4938jvkuelb238210gaswsd',
                    firstName: 'Anastassy',
                    lastName: 'Cap',
                    phone: '5140006868',
                    countryCode: '1',
                    //  email: 'anacap123@gmail.com',   //  Missing email
                    bio: 'My bio'
                };
                const endpoint = '/api/user/createUser';
                const expectedStatusCode = 400;
                const userRepoSpy = jest.spyOn(userRepo, 'createUser').mockResolvedValueOnce(httpStatusCode.OK);

                //  Act
                const res = await request(app).post(endpoint).send({
                    user: badUser
                });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
        });

        ///////////////////////////////////////
        //    ADDNEWUSERACTIVITY EDNPOINT    //
        ///////////////////////////////////////
        describe('addNewUserActivity endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return CREATED[201] and an activity if user exists.', async () => {
                //  Arrange
                const endpoint = `/api/user/addActivity/${user.firebase_id}`;
                const expectedStatusCode = 201;
                const userRepoSpy = jest.spyOn(userRepo, 'addNewUserActivity').mockResolvedValueOnce({
                    success: true,
                    //@ts-expect-error
                    activity: activity
                });

                // @ts-ignore
                activity.id = jest.fn(); // add the 'id' attribute since it is required by the 'createChat' function

                //  Act
                const res = await request(app).post(endpoint).send({
                    user: user,
                    activity: activity
                });

                // @ts-ignore
                delete activity.id;

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body.success).toEqual(true);
                expect(res.body.activity).toEqual(activity);

                expect(userRepoSpy).toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if activity tag is missing.', async () => {
                //  Arrange
                const endpoint = `/api/user/addActivity/${user.firebase_id}`;
                const expectedStatusCode = 400;
                const userRepoSpy = jest.spyOn(userRepo, 'addNewUserActivity').mockResolvedValueOnce(emptyResultValue);

                //  Act
                const res = await request(app).post(endpoint).send({
                    //  activity: activity  //  missing activity tag
                });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[404] if id parameter is missing.', async () => {
                //  Arrange
                const badId = '';
                const endpoint = `/api/user/addActivity/${badId}`; //  Missing id parameter
                const expectedStatusCode = 404;
                const userRepoSpy = jest.spyOn(userRepo, 'addNewUserActivity').mockResolvedValueOnce(emptyResultValue);

                //  Act
                const res = await request(app).post(endpoint).send({
                    //  activity: activity  //  missing activity tag
                });

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);

                expect(res.body).toEqual({});

                expect(userRepoSpy).not.toHaveBeenCalled();

                userRepoSpy.mockRestore();
            });
        });
    });
});
