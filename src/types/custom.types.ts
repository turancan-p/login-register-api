import { UserRoles } from '../models/user.model';

export type User = {
		name?: string,
		userName?: string,
		role?: UserRoles
}
