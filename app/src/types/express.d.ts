// Extend Express types
declare namespace Express {
  export interface Request {
    startTime?: number;
  }
}