declare namespace Express {
  interface Request {
    id: number;
    uuid: string;
    userType: string;
  }
}
