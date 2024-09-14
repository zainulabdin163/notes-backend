type TSignUpBody = {
  username?: string;
  email?: string;
  password?: string;
};

type TSignInBody = {
  username?: string;
  password?: string;
};

export type { TSignUpBody, TSignInBody };
