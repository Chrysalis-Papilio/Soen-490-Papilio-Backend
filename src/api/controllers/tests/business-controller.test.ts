import request from 'supertest';
import app, { server } from '../../../app';
import { APIError } from '../../../errors/api-error';
import { httpStatusCode } from '../../../types/httpStatusCodes';
import { businessRepo } from '../../repos';
jest.mock('sequelize');

/**
 * GET
 *  - getBusinessById
 *  - getEmployeeList
 *  - getActivityList
 *  - getEmployee
 * POST
 *  - createBusiness
 *  - addNewEmployee
 *  - addNewActivity
 * DELETE
 *  - removeEmployee
 *  - removeActivity
 * PUT
 *  - updateBusiness
 *  - updateEmployee
 */

describe('BusinessController', () => {
    afterEach(() => {
        server.close();
    });
    /** used to return empty responses */
    let emptyResultValue: any = null;

    /** testing business object */
    const testEmployee = {
        firebase_id: 'uf4938jvkuelb238210gaswsd',
        firstName: 'Mike',
        lastName: 'LP',
        email: 'anacap123@gmail.com',
        root: true,
        role: 'Admin'
    };

    /** testing acitvity object */
    const testActivity = {
        activityId: 5,
        title: 'title',
        description: 'description',
        address: 'address',
        startTime: '04 October 2011 14:48 UTC',
        costPerIndividual: 5,
        costPerGroup: 100,
        groupSize: 10,
        endTime: '05 October 2011 14:48 UTC'
    };

    /** testing buesiness object */
    const testBusiness = {
        businessId: 'testId',
        name: 'testName',
        address: 'An address',
        email: 'testingEmail@gmail.com'
    };

    /////////////////////////
    //                     //
    //    GET ENDPOINTS    //
    //                     //
    /////////////////////////
    /**
     *  - getBusinessById
     *  - getEmployeeList
     *  - getActivityList
     *  - getEmployee
     */

    describe('GET /business', () => {
        afterEach(() => {
            server.close();
        });
        ///////////////////////////////
        //  GETBUSINESSBYID EDNPOINT //
        ///////////////////////////////
        describe('getBusinessById endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and and a valid business if business found.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getBusinessById').mockResolvedValueOnce({
                    found: true,
                    // @ts-expect-error
                    business: testBusiness
                });

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.found).toEqual(true);
                expect(response.body.business.businessId).toEqual(testBusiness.businessId);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                expect(businessRepoSpy).toHaveBeenCalledWith(testBusiness.businessId);
                businessRepoSpy.mockRestore();
            });
            it('should return OK[200] and not found if business not found.', async () => {
                //  Arrange
                const badID = 'bad ID';

                const endpoint = `/api/business/get/${badID}`;
                const expectedStatusCode = 200;

                const businessRepoSpy = jest.spyOn(businessRepo, 'getBusinessById').mockResolvedValueOnce({
                    found: false,
                    business: null
                });

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.found).toEqual(false);
                expect(response.body.business).toEqual(null);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                expect(businessRepoSpy).toHaveBeenCalledWith(badID);
                businessRepoSpy.mockRestore();
            });
            it('should return OK[202] if passed parameters is passing an empty string.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${emptyResultValue}`; //  Missing ID tag (:id)
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getBusinessById').mockResolvedValueOnce(emptyResultValue);

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body).toEqual(null);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
        });
        ////////////////////////////////
        //  GETEMPLOYEELIST EDNPOINT  //
        ////////////////////////////////
        describe('getEmployeeList endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and all employees if business found.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}/employees`;
                const expectedStatusCode = 200;
                const secondEmployee = testEmployee;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployeeList').mockResolvedValueOnce({
                    businessId: testBusiness.businessId,
                    count: 2,
                    employees: [testEmployee as any, secondEmployee as any]
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body.count).toBe(2);
                expect(businessRepoSpy).toHaveBeenCalledWith(testBusiness.businessId);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
            it('should return NOTFOUND[409] and an empty array if businesss not found.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}/employees`;
                const expectedStatusCode = 409;

                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployeeList').mockImplementation(() => {
                    throw new APIError(`Cannot find User with firebase_id ${businessRepo.getBusinessById}`, 'getEmployeeList', httpStatusCode.CONFLICT);
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalledWith(testBusiness.businessId);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return OK[200] and an empty array if businesss found with a total of 0 employees.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}/employees`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployeeList').mockResolvedValueOnce({
                    businessId: testBusiness.businessId,
                    count: 0,
                    employees: []
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body.businessId).toEqual(testBusiness.businessId);
                expect(res.body.count).toEqual(0);
                expect(res.body.employees).toEqual([]);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
            it('should throw an error if exception thrown while fetching from DB.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}/employees`;
                const expectedStatusCode = 500;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployeeList').mockImplementation(() => {
                    throw new Error('DB error');
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
        });
        ////////////////////////////////
        //  GETACTIVITYLIST EDNPOINT  //
        ////////////////////////////////
        describe('getActivityList endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and all activities if business found.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}/activities`;
                const expectedStatusCode = 200;
                const secondActivity = testActivity;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getActivityList').mockResolvedValueOnce({
                    businessId: testBusiness.businessId,
                    count: 2,
                    // @ts-expect-error
                    activities: [testActivity, secondActivity]
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body.count).toBe(2);
                expect(businessRepoSpy).toHaveBeenCalledWith(testBusiness.businessId);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
            it('should return OK[200] and an empty array if businesss found with a total of 0 activities.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}/activities`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getActivityList').mockResolvedValueOnce({
                    businessId: testBusiness.businessId,
                    count: 0,
                    activities: []
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body.businessId).toEqual(testBusiness.businessId);
                expect(res.body.count).toEqual(0);
                expect(res.body.activities).toEqual([]);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
            it('should return NOTFOUND[409] and an empty array if no businesss found.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}/activities`;
                const expectedStatusCode = 409;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getActivityList').mockImplementation(() => {
                    throw new APIError(`Cannot find User with firebase_id ${businessRepo.getBusinessById}`, 'getActivityList', httpStatusCode.CONFLICT);
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalledWith(testBusiness.businessId);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should throw an error if exception thrown while fetching from DB.', async () => {
                //  Arrange
                const endpoint = `/api/business/get/${testBusiness.businessId}/activities`;
                const expectedStatusCode = 500;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getActivityList').mockImplementation(() => {
                    throw new Error('DB error');
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
        });
        ///////////////////////////////
        //    GETEMPLOYEE EDNPOINT   //
        ///////////////////////////////
        describe('getEmployee endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and valid user if business found.', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/employee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployee').mockResolvedValueOnce({
                    // @ts-expect-error
                    employee: testEmployee
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body.employee.firebase_id).toBe(testEmployee.firebase_id);
                expect(businessRepoSpy).toHaveBeenCalledWith(testBusiness.businessId, testEmployee.firebase_id);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
            it('should return CONFLICT[409] and valid user if business is not found.', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/employee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 409;

                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployee').mockImplementation(() => {
                    throw new APIError(`Cannot find User with firebase_id ${businessRepo.getBusinessById}`, 'getEmployee', httpStatusCode.CONFLICT);
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalledWith(testBusiness.businessId, testEmployee.firebase_id);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return OK[200] and valid user if business found and no employee found.', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/employee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployee').mockResolvedValueOnce({
                    // @ts-expect-error
                    employee: {}
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body).toStrictEqual({ employee: {} });
                expect(businessRepoSpy).toHaveBeenCalledWith(testBusiness.businessId, testEmployee.firebase_id);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
            it('should return NOTFOUND[404] if missing businessID tag.', async () => {
                //  Arrange
                const endpoint = `/api/business//employee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 404;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployee').mockResolvedValueOnce({
                    // @ts-expect-error
                    employee: {}
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(businessRepoSpy).not.toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return OK[200] if passing empty string as a parameter for the businessID tag.', async () => {
                //  Arrange
                const endpoint = `/api/business/${emptyResultValue}/employee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'getEmployee').mockResolvedValueOnce({
                    // @ts-expect-error
                    employee: {}
                });

                //  Act
                const res = await request(app).get(endpoint);

                //  Assert
                expect(res.statusCode).toBe(expectedStatusCode);
                expect(res.body).toStrictEqual({ employee: {} });
                expect(businessRepoSpy).toHaveBeenCalledWith('null', testEmployee.firebase_id);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
        }); // GETEMPLOYEE
    }); // DESCRIBE GET

    //////////////////////////
    //                      //
    //    POST ENDPOINTS    //
    //                      //
    //////////////////////////
    /**
     *   - createBusiness
     *   - addNewEmployee
     *   - addNewActivity
     */

    describe('POST /business', () => {
        ///////////////////////////////
        //  CREATEBUSINESS EDNPOINT  //
        ///////////////////////////////
        afterEach(() => {
            server.close();
        });
        describe('createBusiness endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return CONFLICT[409] if business already exists', async () => {
                //  Arrange
                const endpoint = `/api/business/createBusiness`;
                const expectedStatusCode = 409;
                const businessRepoSpy = jest.spyOn(businessRepo, 'createBusinessWithEmployeeAddress').mockImplementation(() => {
                    throw new APIError(`Business ID ${testBusiness.businessId} already exists`, 'createBusiness', httpStatusCode.CONFLICT, true);
                });

                //  Act
                const response = await request(app)
                    .post(endpoint)
                    .send({
                        business: testBusiness,
                        employee: testEmployee
                    })
                    .set('Content-Type', 'application/json');

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalledTimes(1);
                businessRepoSpy.mockRestore();
            });
            it('should return CREATED[201] if business does not exists', async () => {
                //  Arrange
                const endpoint = '/api/business/createBusiness';
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'createBusinessWithEmployeeAddress').mockResolvedValueOnce({
                    found: true,
                    // @ts-expect-error
                    business: testBusiness
                });
                const businessRepoSpy2 = jest.spyOn(businessRepo, 'getBusinessById').mockResolvedValueOnce({
                    found: true,
                    // @ts-expect-error
                    business: testBusiness
                });

                //  Act
                const response = await request(app)
                    .post(endpoint)
                    .send({
                        business: testBusiness,
                        employee: testEmployee
                    })
                    .set('Content-Type', 'application/json');

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalled();
                expect(businessRepoSpy2).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if passed parameters are missing core fields.', async () => {
                //  Arrange
                const endpoint = '/api/business/createBusiness';
                const expectedStatusCode = 400;
                const businessRepoSpy = jest.spyOn(businessRepo, 'createBusinessWithEmployeeAddress').mockResolvedValueOnce({
                    found: false,
                    //@ts-expect-error
                    business: testBusiness
                });

                //  Act
                const res = await request(app)
                    .post(endpoint)
                    .send({
                        //  business: testBusiness, //  Missing business tag
                        employee: testEmployee
                    })
                    .set('Content-Type', 'application/json');

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                businessRepoSpy.mockRestore();
            });
        }); //  DESCRIBE createBusiness endpoint

        ///////////////////////////////
        //  ADDNEWEMPLOYEE EDNPOINT  //
        ///////////////////////////////
        describe('addNewEmployee endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return CONFLICT[409] if employee and/or business does not exists', async () => {
                //  Arrange
                const endpoint = `/api/business/addEmployee/${testBusiness.businessId}`;
                const expectedStatusCode = 409;
                const businessRepoSpy = jest.spyOn(businessRepo, 'addNewEmployee').mockImplementation(() => {
                    throw new APIError(`Business ID ${testBusiness.businessId} already exists`, 'addEmployee', httpStatusCode.CONFLICT, true);
                });
                //  Act
                const res = await request(app).post(endpoint).send({
                    businessId: testBusiness.businessId,
                    employee: testEmployee
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });

            it('should return OK[200] if both employee and business exists', async () => {
                //  Arrange
                const endpoint = `/api/business/addEmployee/${testBusiness.businessId}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'addNewEmployee').mockResolvedValueOnce({
                    id: testBusiness.businessId,
                    //@ts-expect-error
                    employee: testEmployee
                });
                //  Act
                const res = await request(app).post(endpoint).send({
                    success: true,
                    businessId: testBusiness.businessId,
                    employee: testEmployee
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(res.body.id).toEqual(testBusiness.businessId);
                expect(res.body.employee).toEqual(testEmployee);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if passed parameters are missing core fields.', async () => {
                //  Arrange
                const endpoint = `/api/business/addEmployee/${testBusiness.businessId}`;
                const expectedStatusCode = 400;
                const testEmployee2 = {
                    firebase_id: 'uf4938jvkuelb238210gaswsd',
                    firstName: 'Anastassy',
                    lastName: 'Cap',
                    //  email: 'anacap123@gmail.com',   // Missing param
                    root: true,
                    role: 'Admin'
                };
                const businessRepoSpy = jest.spyOn(businessRepo, 'addNewEmployee').mockResolvedValueOnce({
                    id: testBusiness.businessId,
                    //@ts-expect-error
                    employee: testEmployee2
                });
                //  Act
                const res = await request(app).post(endpoint).send({
                    success: true,
                    businessId: testBusiness.businessId,
                    employee: testEmployee2
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                businessRepoSpy.mockRestore();
            });
        }); //  DESCRIBE addNewEmployee endpoint
    }); // DESCRIBE POST

    ////////////////////////////
    //                        //
    //    DELETE ENDPOINTS    //
    //                        //
    ////////////////////////////
    /**
     *   - removeEmployee
     *   - removeActivity
     */

    // TODO: Implement tests
    describe('DELETE /business', () => {
        ///////////////////////////////
        //  REMOVEEMPLOYEE EDNPOINT  //
        ///////////////////////////////
        describe('removeEmployee endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] if employee & business exists', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/removeEmployee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'removeEmployee').mockResolvedValueOnce({
                    success: true
                });
                //  Act
                const res = await request(app).del(endpoint);
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(res.body.success).toEqual(true);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return CONFLICT[409] if employee or business does not exists', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/removeEmployee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 409;
                const businessRepoSpy = jest.spyOn(businessRepo, 'removeEmployee').mockImplementation(() => {
                    throw new APIError(`Cannot find User with firebase_id ${businessRepo.getBusinessById}`, 'removeEmployee', httpStatusCode.CONFLICT);
                });
                //  Act
                const res = await request(app).del(endpoint);
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return NOTFOUND[404] if passed parameters are missing core fields.', async () => {
               //  Arrange
               const endpoint = `/api/business//removeEmployee/${testActivity.activityId}`;   //  Missing businessID
               const expectedStatusCode = 404;
               const businessRepoSpy = jest.spyOn(businessRepo, 'removeEmployee').mockResolvedValueOnce({
                   success: true
               });
               //  Act
               const res = await request(app).del(endpoint);
               //  Assert
               expect(res.statusCode).toEqual(expectedStatusCode);
               expect(businessRepoSpy).not.toHaveBeenCalled();
               businessRepoSpy.mockRestore();
            });
        }); //  removeEmployee enpoint

        ///////////////////////////////
        //  REMOVEACTIVITY EDNPOINT  //
        ///////////////////////////////
        describe('removeActivity endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] if acitivty & business exists', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/removeActivity/${testActivity.activityId}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'removeActivity').mockResolvedValueOnce({
                    success: true
                });
                //  Act
                const res = await request(app).del(endpoint);
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(res.body.success).toEqual(true);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return CONFLCIT[409] if activity or business does not exists', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/removeActivity/${testActivity.activityId}`;
                const expectedStatusCode = 409;
                const businessRepoSpy = jest.spyOn(businessRepo, 'removeActivity').mockImplementation(() => {
                    throw new APIError(`Cannot find User with firebase_id ${businessRepo.getBusinessById}`, 'removeActivity', httpStatusCode.CONFLICT);
                });
                //  Act
                const res = await request(app).del(endpoint);
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if passed parameters are missing core fields.', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/removeActivity/${testEmployee.firebase_id}`;   //  Passing employee instead of activity
                const expectedStatusCode = 400;
                const businessRepoSpy = jest.spyOn(businessRepo, 'removeActivity').mockResolvedValueOnce({
                    success: true
                });
                //  Act
                const res = await request(app).del(endpoint);
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(businessRepoSpy).not.toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
        }); //  removeActivity enpoint
    }); // DESCRIBE DELETE

    //////////////////////////
    //                      //
    //    PUT ENDPOINTS     //
    //                      //
    //////////////////////////
    /**
     *   - updateBusiness
     *   - updateEmployee
     */
    // TODO: Implement tests
    describe('PUT /business', () => {
        ///////////////////////////////
        //  UPDATEBUSINESS EDNPOINT  //
        ///////////////////////////////
        describe('updateBusiness endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] if business exists', async () => {
                //  Arrange
                const endpoint = `/api/business/update/${testBusiness.businessId}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'updateBusiness').mockResolvedValueOnce({
                    success: true,
                    //@ts-expect-error
                    business: testBusiness
                });
                //  Act
                const res = await request(app).put(endpoint).send({
                    identifier: {
                        businessId: testBusiness.businessId
                    },
                    update: {
                        name: testBusiness.name
                    }
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(res.body.success).toEqual(true);
                expect(res.body.business.name).not.toEqual(testBusiness.name+'x');
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return OK[200] if business does not exists', async () => {
                //  Arrange
                const endpoint = `/api/business/update/${testBusiness.businessId}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'updateBusiness').mockResolvedValueOnce({
                    success: false,
                    //@ts-expect-error
                    business: testBusiness
                });
                //  Act
                const res = await request(app).put(endpoint).send({
                    identifier: {
                        businessId: testBusiness.businessId
                    },
                    update: {
                        name: testBusiness.name
                    }
                });;
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(res.body.success).toEqual(false);
                expect(res.body.business.name).not.toEqual(testBusiness.name+'x');
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if passed parameters are missing core fields.', async () => {
                //  Arrange
                const endpoint = `/api/business/update/${testBusiness.businessId}`;
                const expectedStatusCode = 400;
                const businessRepoSpy = jest.spyOn(businessRepo, 'updateBusiness').mockResolvedValueOnce({
                    success: true,
                    //@ts-expect-error
                    business: testBusiness
                });
                //  Act
                const res = await request(app).put(endpoint).send({
                    identifier: {
                        businessId: testBusiness.businessId
                    },
                    update: {
                        name: testBusiness  //  Missing name
                    }
                });;
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(businessRepoSpy).not.toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
        }); //  updateBusiness endpoint

        ///////////////////////////////
        //  UPDATEEMPLOYEE EDNPOINT  //
        ///////////////////////////////
        describe('updateEmployee endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] if employee exists', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/updateEmployee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'updateEmployee').mockResolvedValueOnce({
                    success: true,
                });
                //  Act
                const res = await request(app).put(endpoint).send({
                    update: {
                        role: testEmployee.role+'x'
                    }
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(res.body.success).toEqual(true);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return OK[200] if employee does not exists', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/updateEmployee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 200;
                const businessRepoSpy = jest.spyOn(businessRepo, 'updateEmployee').mockResolvedValueOnce({
                    success: false,
                });
                //  Act
                const res = await request(app).put(endpoint).send({
                    update: {
                        role: testEmployee.role+'x'
                    }
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(res.body.success).toEqual(false);
                expect(businessRepoSpy).toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if passed parameters are missing core fields.', async () => {
                //  Arrange
                const endpoint = `/api/business/${testBusiness.businessId}/updateEmployee/${testEmployee.firebase_id}`;
                const expectedStatusCode = 400;
                const businessRepoSpy = jest.spyOn(businessRepo, 'updateEmployee').mockResolvedValueOnce({
                    success: true,
                });
                //  Act
                const res = await request(app).put(endpoint).send({
                    //  Missing Update param
                });
                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(businessRepoSpy).not.toHaveBeenCalled();
                businessRepoSpy.mockRestore();
            });
        }); //  updateEmployee endpoint
    }); // DESCRIBE PUT
}); //  DESCRIBE BUSINESSCONTROLLER
