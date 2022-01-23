const SUCCESS = { status: 200, message: 'Success!' };
const ACCEPTED = { status: 202, message: 'Accepted!' };
const BADREQUEST = { status: 400, message: 'bad request' };
const UNAUTHORIZED = { status: 401, message: 'unauthorized' };
const NOTFOUND = { status: 404, message: 'not found' };
const IMATEAPOT = { status: 418, message: "I'm a teapot" }
const INTERNALSERVERERROR = { status: 500, message: 'internal server error' };

module.exports = {
    SUCCESS,
    ACCEPTED,
    BADREQUEST,
    UNAUTHORIZED,
    NOTFOUND,
    IMATEAPOT,
    INTERNALSERVERERROR,
};