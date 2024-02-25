export interface ISendCockiesAndTokens {
  access: string;
  refresh: string;
  email: string;
  name: string;
  uuid: string;
  id: number;
  refreshTokenName: string;
  [x: string]: string | number;
}
