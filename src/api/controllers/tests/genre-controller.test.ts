import request from 'supertest';
import app, { server } from '../../../app';
import { APIError } from '../../../errors/api-error';
import { httpStatusCode } from '../../../types/httpStatusCodes';
import { genreRepo } from '../../repos';
jest.mock('sequelize');

/**
 * GET
 *  - getAllGenres
 * POST
 *  - addGenre
 */

describe('GenreController', () => {
    afterEach(() => {
        server.close();
    });

    /////////////////////////
    //                     //
    //    GET ENDPOINTS    //
    //                     //
    /////////////////////////
    /**
     *  - getAllGenres
     */

    describe('GET /genre', () => {
        afterEach(() => {
            server.close();
        });
        ///////////////////////////////
        //  GETALLGENRES EDNPOINT    //
        ///////////////////////////////
        describe('getAllGenres endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return OK[200] and and a valid list of genres.', async () => {
                //  Arrange
                const endpoint = `/api/genre/all`;
                const expectedStatusCode = 200;
                const genreRepoSpy = jest.spyOn(genreRepo, 'getAllGenres').mockResolvedValueOnce({
                    id: 1,
                    name: 'Soccer',
                    url: null,
                    category: 'sport',
                    createdAt: '2023-01-18T03:50:10.550Z',
                    updatedAt: '2023-01-18T03:50:10.550Z'
                } as any);

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body[0]).not.toEqual({});
                expect(genreRepoSpy).toHaveBeenCalledTimes(1);
                genreRepoSpy.mockRestore();
            });
            it('should return OK[200] if business no genres are found.', async () => {
                //  Arrange
                const endpoint = `/api/genre/all`;
                const expectedStatusCode = 200;
                const genreRepoSpy = jest.spyOn(genreRepo, 'getAllGenres').mockResolvedValueOnce({} as any);

                //  Act
                const response = await request(app).get(endpoint);

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body).toEqual({});
                expect(genreRepoSpy).toHaveBeenCalledTimes(1);
                genreRepoSpy.mockRestore();
            });
        }); // DESCRIBE GETALLENDPOINT
    }); // DESCRIBE GET ENDPOINTS

    //////////////////////////
    //                      //
    //    POST ENDPOINTS    //
    //                      //
    //////////////////////////
    /**
     *   - addGenre
     */

    describe('POST /genre', () => {
        ///////////////////////////////
        //      ADDGENRE EDNPOINT    //
        ///////////////////////////////
        afterEach(() => {
            server.close();
        });
        describe('addGenre endpoint', () => {
            afterEach(() => {
                server.close();
            });
            it('should return CONFLICT[409] if genre already exists', async () => {
                //  Arrange
                const endpoint = `/api/genre/add`;
                const expectedStatusCode = 409;
                const genreRepoSpy = jest.spyOn(genreRepo, 'addGenre').mockImplementation(() => {
                    throw new APIError(`Genre name Crafts already exists`, 'addGenre', httpStatusCode.CONFLICT, true);
                });

                //  Act
                const response = await request(app)
                    .post(endpoint)
                    .send({
                        genre: {
                            name: 'Crafts',
                            category: 'art'
                        }
                    })
                    .set('Content-Type', 'application/json');

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(genreRepoSpy).toHaveBeenCalledTimes(1);
                genreRepoSpy.mockRestore();
            });
            it('should return CREATED[201] if genre does not exists', async () => {
                //  Arrange
                const endpoint = '/api/genre/add';
                const expectedStatusCode = 201;
                const genreRepoSpy = jest.spyOn(genreRepo, 'addGenre').mockResolvedValueOnce({
                    success: true
                });

                //  Act
                const response = await request(app)
                    .post(endpoint)
                    .send({
                        genre: {
                            name: 'TestCrafts',
                            category: 'art'
                        }
                    })
                    .set('Content-Type', 'application/json');

                //  Assert
                expect(response.statusCode).toEqual(expectedStatusCode);
                expect(response.body.success).toEqual(true);
                expect(genreRepoSpy).toHaveBeenCalled();
                genreRepoSpy.mockRestore();
            });
            it('should return BADREQUEST[400] if passed parameters are missing core fields.', async () => {
                //  Arrange
                const endpoint = '/api/genre/add';
                const expectedStatusCode = 400;
                const genreRepoSpy = jest.spyOn(genreRepo, 'addGenre').mockResolvedValueOnce({
                    success: false
                });

                //  Act
                const res = await request(app)
                    .post(endpoint)
                    .send({
                        genre: {
                            //name: "TestCrafts", missing name
                            category: 'art'
                        }
                    })
                    .set('Content-Type', 'application/json');

                //  Assert
                expect(res.statusCode).toEqual(expectedStatusCode);
                expect(genreRepoSpy).not.toHaveBeenCalled();
                genreRepoSpy.mockRestore();
            });
        }); //  DESCRIBE addGenre endpoint
    }); // DESCRIBE POST
}); //  DESCRIBE GENRECONTROLLER
