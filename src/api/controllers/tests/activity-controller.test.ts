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
        title: 'Title of Activity',
        description: 'Description of the current Activity',
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
    });
});
