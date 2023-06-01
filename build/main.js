"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./configs/config");
const http_1 = __importDefault(require("http"));
const routers_1 = __importDefault(require("./routers"));
const app = (0, express_1.default)();
//connect database and start server
mongoose_1.default.connect(config_1.config.database.mongo.url).then(() => {
    console.log('MongoDB connection established.');
    startServer();
}).catch((error) => {
    console.log('MongoDB connection unable.');
    console.log(error);
});
// Server start function
const startServer = () => {
    app.use((req, res, next) => {
        const getIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        const ip = getIp.split(',')[0];
        console.log(`Incoming -> METHOD: [${req.method}] to URL: [${req.url}] from IP: [${ip}]`);
        res.on('finish', () => {
            console.log(`Finish -> METHOD: [${req.method}] to URL: [${req.url}] from IP: [${ip}]`);
        });
        next();
    });
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    // Add Routes
    app.use("/", (0, routers_1.default)());
    //Health check
    app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
    //Error
    app.use((req, res, next) => {
        const error = new Error('Page Not Found!');
        console.log(`Not Found -> METHOD: [${req.method}] to URL: [${req.url}]`);
        return res.status(404).json({ message: error.message });
    });
    http_1.default.createServer(app).listen(config_1.config.server.port, () => console.log(`API started on port: ${config_1.config.server.port}`));
};
