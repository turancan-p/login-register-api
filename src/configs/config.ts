//for api port
const PORT = 3001;

//for jwt token
const SECRET_KEY = "1234-secret-key."

//for mongo
const MONGO_USERNAME = '';
const MONGO_PASSWORD = '';
const MONGO_LINK = '';
const MONGO_DBNAME = '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_LINK}/${MONGO_DBNAME}?retryWrites=true&w=majority`;

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