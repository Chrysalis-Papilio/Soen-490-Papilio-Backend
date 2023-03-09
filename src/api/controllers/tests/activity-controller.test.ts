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
                expect(activityRepoGetActivitySpy).toHaveBeenCalledWith(mockActivityId, false);
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
                expect(activityRepoGetActivitySpy).toHaveBeenCalledWith(notFoundActivityId, false);
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.found).toBeFalsy();
                expect(response.body.activity).toBeNull();

                activityRepoGetActivitySpy.mockRestore();
            });

            it('should return OK[200] and a valid response with contact info if Activity found', async () => {
                // Arrange
                const endpoint = `/api/activity/get/${mockActivityId}?contact=1`;
                const expectedStatusCode = 200;
                const activityRepoGetActivitySpy = jest.spyOn(activityRepo, 'getActivity').mockResolvedValueOnce({
                    found: true,
                    activity: {
                        ...mockActivity,
                        // @ts-ignore 'activity' adding other attributes, doesn't matter
                        user: null,
                        business: {
                            businessId: 'something',
                            email: 'contact@something.com'
                        }
                    }
                });

                // Act
                const response = await request(app).get(endpoint);

                // Assert
                expect(activityRepoGetActivitySpy).toHaveBeenCalledTimes(1);
                expect(activityRepoGetActivitySpy).toHaveBeenCalledWith(mockActivityId, true); // 'true' mandatory
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.found).toBeTruthy();
                expect(response.body.activity.business).toBeDefined();

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
                const endpoint = '/api/activity/getFeeds?size=5&page=3';
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
                const activityRepoSearchActivitiesSpy = jest.spyOn(activityRepo, 'searchActivities').mockResolvedValue({
                    keyword: 'example',
                    count: 0,
                    rows: []
                });

                // Act
                const response = await request(app).post(endpoint);

                // Assert
                expect(activityRepoSearchActivitiesSpy).toHaveBeenCalledTimes(0);
                expect(response.statusCode).toEqual(expectedStatusCode);

                activityRepoSearchActivitiesSpy.mockRestore();
            });
        });
    });
});
