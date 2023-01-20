import request from 'supertest';
import app, {server} from '../../../app';
import { userRepo } from '../../repos';


describe("UserController", () => {
    afterEach(() => {
        server.close()
    })
    let resultValue : any = {};
    describe("GET /user", () => {
        describe('getAllUsers endpoint', () => {
            afterEach(() => {
                server.close()
            })
            it("returns an non-empty array of users.", async () => {
                //  Arrange
                const endpoint = '/api/user/getAllUsers';
                const expectedStatusCode = 200;
                const userRepoSpy = jest
                .spyOn(userRepo, 'getAllUsers')
                //  @ts-expect-error
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
                .spyOn(userRepo, 'getAllUsers')
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
            afterEach(() => {
                server.close()
            })
            it("should return the correct user.", async () => {
                //  Arrange
                const testEmail = 'sample2@gmail.com';
                const endpoint = `/api/user/getUserByEmail/${testEmail}`;
                const expectedStatusCode = 200;
                const userRepoSpy = jest
                .spyOn(userRepo, 'getUserByEmail')
                .mockResolvedValueOnce({
                    found: true,
                    //  @ts-expect-error
                    user: {
                    firebase_id: '1fnj3u4hsd',
                    firstName: 'Lenny',
                    lastName: 'Jenkins-Joules',
                    email: 'sample2@gmail.com',
                    phone: '6146156164',
                    countryCode: 1,
            }});

                //  Act
                const res = await request(app)
                .get(endpoint)
                .send({
                    email: testEmail
                });
                console.log(res.body);
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(userRepoSpy).toHaveBeenCalledWith(testEmail);
                expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
                expect(res.body.found).toEqual(true);
                expect(res.body.user.firebase_id).toEqual('1fnj3u4hsd');
                expect(res.body.user.firstName).toEqual('Lenny');
                expect(res.body.user.lastName).toEqual('Jenkins-Joules');
                expect(res.body.user.email).toEqual('sample2@gmail.com');
                expect(res.body.user.phone).toEqual('6146156164');
                expect(res.body.user.countryCode).toEqual(1);
                userRepoSpy.mockRestore();
            });

            it("should return a BADREQUEST[400] status code.", async () => {
                //  Arrange
                const testEmail = 'invalidEmail';
                const endpoint = `/api/user/getUserByEmail/${testEmail}`;
                const expectedStatusCode = 400;
                const userRepoSpy = jest
                .spyOn(userRepo, 'getUserByEmail')
                .mockResolvedValue(resultValue);

                //  Act
                const res = await request(app)
                .get(endpoint)
                .send({
                    email: testEmail
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(userRepoSpy).not.toHaveBeenCalled();
                expect(res.body).toEqual({});
                userRepoSpy.mockRestore();
            });
        });
    });

    /** Testing POST endpoints. */
    describe("POST /user", () => {
        describe('createUser endpoint', () => {
            afterEach(() => {
                server.close()
            })
            it("should return a BADREQUEST[400] status code.", async () => {
                //  Arrange
                const endpoint = '/api/user/createUser'
                const expectedStatusCode = 400;
                const userRepoSpy = jest
                .spyOn(userRepo, 'createUser')
                .mockResolvedValue(resultValue);
                const user = {
                    id: 1,
                    //  missing firebase_id: '1fnj3u4hsd',
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
        });
        test("Updates a user profile and returns the user object.", async () => {
            //  Act
            const endpoint = '/api/user/updateUserProfile'
            const firebase_id = 'uf4938jvkuelb238210gaswsd'
            const firstname = 'Anastassy';
            const lastName = 'Cap';
            const phone = '';
            const countryCode = 1;
            const email = 'anacap123@gmail.com';
            const expectedStatusCode = 200;
            const user = {
                firebase_id: firebase_id,
                firstName: firstname,
                lastName: lastName,
                email: email,
                phone: phone,
                countryCode: countryCode,
                bio: 'my bio'
            }
            const userRepoSpy = jest
                .spyOn(userRepo, 'updateUser')
                .mockResolvedValueOnce(
                    {   success: true,
                        //  @ts-expect-error
                        update: user
                    });

            //  Arrange
            const res = await request(app)
            .post(endpoint)
            .send({
                identifier: {
                    firebase_id: firebase_id
                },
                update: {
                    email: user.email
                }
            });

            //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(userRepoSpy).toHaveBeenCalledTimes(1);
                expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
                expect(res.body.success).toEqual(true);
                expect(res.body.update.firebase_id).toEqual(firebase_id);
                expect(res.body.update.firstName).toEqual(firstname);
                expect(res.body.update.lastName).toEqual(lastName);
                expect(res.body.update.email).toEqual(email);
                expect(res.body.update.phone).toEqual(phone);
                expect(res.body.update.countryCode).toEqual(countryCode);
                userRepoSpy.mockRestore();
        });
    });
});