import express from 'express';

import * as UserController from '../controllers/user.controller'
import { handleTokenBasedAuth } from '../middleware/authentication';

export default (router: express.Router) => {
    router.post('/register', UserController.register);
    router.post('/login', UserController.login);
    router.get('/test', handleTokenBasedAuth, UserController.testPage);
    router.post('/update', handleTokenBasedAuth, UserController.updateUser);
}
