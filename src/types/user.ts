export interface IUserClient {
  _id?: string;
  username: string;
  email: string;
  image?: string;
  provider?: string;
  emailVerified?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
