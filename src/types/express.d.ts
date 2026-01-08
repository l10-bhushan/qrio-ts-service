import type { AuthUser } from "./authuser.model.ts";

// Adding the authuser to global Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      cookie?: any;
    }
  }
}

export {};
