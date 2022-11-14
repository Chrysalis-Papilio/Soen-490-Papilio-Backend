// it("should return a NOTFOUND[404] status code.", async () => {
//     //  Arrange
//     const endpoint = '/api/user/getUserByEmai';
//     const testEmail = 'sample2@gmail.com';
//     const expectedStatusCode = 404;
//     const userRepoSpy = jest
//     .spyOn(userRepos, 'getUserByEmail')

//     //  Act
//     const res = await request(app)
//     .get(endpoint)
//     .send({
//         email: testEmail
//     });

//     //  Assert
//     expect(res.statusCode).toBe(expectedStatusCode);
//     expect(userRepoSpy).toHaveBeenCalledTimes(0);
//     userRepoSpy.mockRestore();
// });