declare module 'Types' {
  interface IUser {
    id: number;
    color: string;
    name: string;
    email: string;
  }
  interface ILoginResponse {
    login: {
      token: string;
      user: IUser;
    };
  }
  interface ISignupResponse {
    signup: {
      token: string;
      user: IUser;
    };
  }

  interface IMessage {
    id: number;
    text: string;
    createdAt: string;
    postedBy: IUser;
  }
}
