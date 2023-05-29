import express from 'express';

import * as UserController from '../controllers/user.controller'

export default (router: express.Router) => {
    router.post('/register', UserController.register);
}