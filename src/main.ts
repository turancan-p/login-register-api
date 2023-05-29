import express from "express";
import { config } from "./configs/config";
import http from 'http';


const app = express();

// Server start function
const startServer = () => {
    app.use((req, res, next) => {
        const getIp = <string>req.headers['x-forwarded-for'] || <string>req.socket.remoteAddress || '';
        const ip = getIp.split(',')[0];

        console.log(`Incoming -> METHOD: [${req.method}] to URL: [${req.url}] from IP: [${ip}]`);

        res.on('finish', () => {
            console.log(`Finish -> METHOD: [${req.method}] to URL: [${req.url}] from IP: [${ip}]`);
        });
        
        next();
    })

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    //Health check
    app.get('/ping', (req,res,next) => res.status(200).json({message: 'pong'}));

    //Error
    app.use((req,res,next) => {
        const error = new Error('Page Not Found!');

        console.log(`Not Found -> METHOD: [${req.method}] to URL: [${req.url}]`);
        return res.status(404).json({message: error.message});
    });

    http.createServer(app).listen(config.server.port, () => console.log(`API started on port: ${config.server.port}`));
}


startServer();