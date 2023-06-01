import express from 'express';

import * as UserController from '../controllers/user.controller'
import { handleTokenBasedAuth } from '../middleware/authentication';

export default (router: express.Router) => {
    router.post('/register', UserController.register);
    router.post('/login', UserController.login);
    router.get('/detail', handleTokenBasedAuth, UserController.detailUser);
    router.post('/update', handleTokenBasedAuth, UserController.updateUser);
    router.post('/delete', handleTokenBasedAuth, UserController.deleteUser);
}
