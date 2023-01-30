export enum httpStatusCode {
    OK = 200, //  Success
    CREATED = 201, //  Resource successfully created
    BAD_REQUEST = 400, //  Client Error
    NOT_FOUND = 404, //  Wrong Url
    CONFLICT = 409, //  Server will not process request (not client fault)
    INTERNAL_SERVER = 500 //  Server Error
}
