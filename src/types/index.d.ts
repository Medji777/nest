import { Users } from '../users/users.schema';

declare global {
  declare namespace Express {
    export interface Request {
      user: (Users & { userId?: string; deviceId?: string }) | null;
      deviceId: string | null;
    }
  }
}
