import { Request } from 'express';
import { User } from '../custom.types';

export interface RequestWithUser extends Request {
  user?: User;
}
