export interface UserSignup {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface UserLogin {
  email: string;
  password: string;
}
