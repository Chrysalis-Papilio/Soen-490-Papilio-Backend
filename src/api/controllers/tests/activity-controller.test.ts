import request from 'supertest';
import app, { server } from '../../../app';
import { activityRepo } from '../../repos';

jest.mock('sequelize');

describe('ActivityController', () => {
    afterEach(() => {
        server.close();
    });

    const mockActivityId = 70;
    const mockActivity = {
        id: 70,
        title: 'Title of Example Activity',
        description: 'Description of the current example Activity',
        images: [],
        address: '1234 Rue Guy, Montreal, QC EXM PLE'
    };
    const mockValidPage = 3;
    const mockValidSize = 5;

    describe('GET /activity', () => {
        describe('getActivity endpoint', () => {
            it('should return OK[200] and a valid response if Activity found', async () => {
                // Arrange
                const endpoint = `/api/activity/get/${mockActivityId}`;
                const expectedStatusCode = 200;
                const activityRepoGetActivitySpy = jest.spyOn(activityRepo, 'getActivity').mockResolvedValueOnce({
                    found: true,
                    // @ts-ignore 'activity' missing other attributes, doesn't matter
                    activity: mockActivity
                });

                // Act
                const response = await request(app).get(endpoint);

                // Assert
                expect(activityRepoGetActivitySpy).toHaveBeenCalledTimes(1);
                expect(activityRepoGetActivitySpy).toHaveBeenCalledWith(mockActivityId);
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.found).toBeTruthy();
                expect(response.body.activity).toEqual(mockActivity);

                activityRepoGetActivitySpy.mockRestore();
            });

            it('should return OK[200] and null activity if Activity not found', async () => {
                // Arrange
                const notFoundActivityId = 2;
                const endpoint = `/api/activity/get/${notFoundActivityId}`;
                const expectedStatusCode = 200;
                const activityRepoGetActivitySpy = jest.spyOn(activityRepo, 'getActivity').mockResolvedValueOnce({
                    found: false,
                    activity: null
                });

                // Act
                const response = await request(app).get(endpoint);

                // Assert
                expect(activityRepoGetActivitySpy).toHaveBeenCalledTimes(1);
                expect(activityRepoGetActivitySpy).toHaveBeenCalledWith(notFoundActivityId);
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.found).toBeFalsy();
                expect(response.body.activity).toBeNull();

                activityRepoGetActivitySpy.mockRestore();
            });
        });

        describe('getAllActivities endpoint', () => {
            it('should return OK[200] and a valid list of Activities', async () => {
                // Arrange
                const endpoint = '/api/activity/getFeeds';
                const expectedStatusCode = 200;
                const activityRepoGetAllActivitiesSpy = jest.spyOn(activityRepo, 'getAllActivities').mockResolvedValueOnce({
                    count: 100,
                    // @ts-ignore - Activity ignore
                    rows: [mockActivity, /* mocking 20 elements */ mockActivity],
                    totalPages: 5,
                    currentPage: 1
                });

                // Act
                const response = await request(app).get(endpoint);

                // Assert
                expect(activityRepoGetAllActivitiesSpy).toHaveBeenCalledTimes(1);
                expect(activityRepoGetAllActivitiesSpy).toHaveBeenCalledWith(1, 20);
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.count).toEqual(100);
                expect(response.body.currentPage).toEqual(1);
                expect(response.body.rows.length).toBeGreaterThan(0);

                activityRepoGetAllActivitiesSpy.mockRestore();
            });

            it('should return OK[200] and a valid list of Activities with correct page', async () => {
                // Arrange
                const endpoint = `/api/activity/getFeeds?size=${mockValidSize}&page=${mockValidPage}`;
                const expectedStatusCode = 200;
                const activityRepoGetAllActivitiesSpy = jest.spyOn(activityRepo, 'getAllActivities').mockResolvedValueOnce({
                    count: 100,
                    // @ts-ignore - Activity ignore
                    rows: [mockActivity, /* mocking 5 elements */ mockActivity],
                    totalPages: 20,
                    currentPage: 3
                });

                // Act
                const response = await request(app).get(endpoint);

                // Assert
                expect(activityRepoGetAllActivitiesSpy).toHaveBeenCalledTimes(1);
                expect(activityRepoGetAllActivitiesSpy).toHaveBeenCalledWith(3, 5);
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.count).toEqual(100);
                expect(response.body.currentPage).toEqual(3);
                expect(response.body.rows.length).toBeGreaterThan(0);

                activityRepoGetAllActivitiesSpy.mockRestore();
            });

            it('should return BAD REQUEST [400] if page is invalid or size is invalid', async () => {
                // Arrange
                const invalidPage = 0; // supposed to be gte(1)
                const invalidSize = 4; // supposed to be gte(5)
                const endpoint1 = `/api/activity/getFeeds?page=${invalidPage}&size=${mockValidSize}`;
                const endpoint2 = `/api/activity/getFeeds?page=${mockValidPage}&size=${invalidSize}`;
                const expectedStatusCode = 400;
                const activityRepoSearchActivitiesSpy = jest.spyOn(activityRepo, 'searchActivities');

                // Act
                const response1 = await request(app).get(endpoint1);
                const response2 = await request(app).get(endpoint2);

                // Assert
                expect(activityRepoSearchActivitiesSpy).toHaveBeenCalledTimes(0);
                expect(response1.statusCode).toEqual(expectedStatusCode);
                expect(response2.statusCode).toEqual(expectedStatusCode);
            });
        });
    });

    describe('POST /activity', () => {
        describe('search endpoint', () => {
            it('should return OK [200] and the search result(s) with the given keyword', async () => {
                // Arrange
                const endpoint = '/api/activity/search';
                const expectedStatusCode = 200;
                const keyword = ' example ';
                const activityRepoSearchActivitiesSpy = jest.spyOn(activityRepo, 'searchActivities').mockResolvedValueOnce({
                    keyword: 'example',
                    count: 1,
                    rows: [mockActivity]
                });

                // Act
                const response = await request(app)
                    .post(endpoint)
                    .send({
                        keyword: keyword
                    })
                    .set('Content-Type', 'application/json');

                // Assert
                expect(activityRepoSearchActivitiesSpy).toHaveBeenCalledTimes(1);
                expect(activityRepoSearchActivitiesSpy).toHaveBeenCalledWith(keyword.trim());
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.keyword).toEqual(keyword.trim());
                expect(response.body.rows.length).toBeGreaterThan(0);
                expect(response.body.rows[0]).toEqual(mockActivity);

                activityRepoSearchActivitiesSpy.mockRestore();
            });

            it('should return BAD REQUEST [400] if no keyword was given', async () => {
                // Arrange
                const endpoint = '/api/activity/search';
                const expectedStatusCode = 400;
                const activityRepoSearchActivitiesSpy = jest.spyOn(activityRepo, 'searchActivities');

                // Act
                const response = await request(app).post(endpoint);

                // Assert
                expect(activityRepoSearchActivitiesSpy).toHaveBeenCalledTimes(0);
                expect(response.statusCode).toEqual(expectedStatusCode);

                activityRepoSearchActivitiesSpy.mockRestore();
            });
        });

        describe('updateActivity endpoint', () => {
            it('should return OK [200] and an updated Activity if passed validation', async () => {
                // Arrange
                const endpoint = `/api/activity/update/${mockActivityId}`;
                const expectedStatusCode = 200;
                const activityRepoUpdateActivitySpy = jest.spyOn(activityRepo, 'updateActivity').mockResolvedValue({
                    success: true,
                    // @ts-ignore
                    activity: mockActivity
                });

                // Act
                let responses = Array(8);
                responses[0] = await request(app)
                    .post(endpoint)
                    .send({ update: { title: 'Another Title' } });
                responses[1] = await request(app)
                    .post(endpoint)
                    .send({ update: { description: 'Another description' } });
                responses[2] = await request(app)
                    .post(endpoint)
                    .send({ update: { address: '123 New Address St, Montreal, QC XAM PLE' } });
                responses[3] = await request(app)
                    .post(endpoint)
                    .send({ update: { startTime: '2023-03-15 10:05:00+00' } });
                responses[4] = await request(app)
                    .post(endpoint)
                    .send({ update: { endTime: '2023-03-15 10:15:00+00' } });
                responses[5] = await request(app)
                    .post(endpoint)
                    .send({ update: { groupSize: 20 } });
                responses[6] = await request(app)
                    .post(endpoint)
                    .send({ update: { costPerIndividual: 14.99 } });
                responses[7] = await request(app)
                    .post(endpoint)
                    .send({ update: { costPerGroup: 199.99 } });

                // Assert
                expect(activityRepoUpdateActivitySpy).toHaveBeenCalledTimes(8);
                expect(activityRepoUpdateActivitySpy).toHaveBeenCalledWith(mockActivityId, expect.anything());
                responses.forEach((response) => {
                    expect(response.statusCode).toEqual(expectedStatusCode);
                    expect(response.body.success).toBeTruthy();
                });

                activityRepoUpdateActivitySpy.mockRestore();
            });

            it('should return BAD REQUEST [400] if no/invalid request body were given', async () => {
                // Arrange
                const endpoint = `/api/activity/update/${mockActivityId}`;
                const expectedStatusCode = 400;

                // Act
                const response1 = await request(app).post(endpoint).send({ updates: {} });
                const response2 = await request(app).post(endpoint).send({ update: {} });
                const response3 = await request(app)
                    .post(endpoint)
                    .send({ update: { id: {} } });

                // Assert
                expect(response1.statusCode).toEqual(expectedStatusCode);
                expect(response2.statusCode).toEqual(expectedStatusCode);
                expect(response3.statusCode).toEqual(expectedStatusCode);
            });
        });
    });
});
