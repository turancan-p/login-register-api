//for api port
const PORT = 3001;

//for jwt token
const SECRET_KEY = "1234-secret-key."

//for mongo
const MONGO_USERNAME = '';
const MONGO_PASSWORD = '';

const MONGO_HOST = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DBNAME = 'usersystem';
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}`;

//export
export const config = {
    database : {
        mongo: {
            url: MONGO_URL
        }
    },
    server : {
        port: PORT
    },
    token : {
        secretKey: SECRET_KEY
    }
}