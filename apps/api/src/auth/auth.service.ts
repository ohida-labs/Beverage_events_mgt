//LOGIN WITH PASSWORD
interface IAuth {
  email: string;
  password: string;
}

interface IResetPassword {
  userId: string;
  old_password: string;
  new_password: string;
}

interface IForgotPassword {
  email: string;
  new_password?: string;
}

interface ISignup extends IAuth {
  first_name: string;
  last_name?: string;
}

export const LoginWithEmailAndPassword = async (arg: IAuth) => {
  try {
    //check up email on db
    //if email don't exist then reuturn NOTFOUND error;
    //Check if password match with the one on db;
    //create a new token: 1d
    //Send back access_token
  } catch (e) {
    throw e;
  }
};

export const SignupWithEmailAndPassword = async (arg: ISignup) => {
  //check up email on db
  //if email don't exist then create user;
  //create user with email and name, encypted password in db
  //create a new refresh: 1week and acccess: 15mins session-jwt.
  //Send back access_token
};

export const PasswordResetService = async (arg: IResetPassword) => {
  //get email from token
  //find users previously encrypted password;
  //login earlier than 10mins
  //1. compare old passwords (in db and from user)
  //User must be recently loggin, Check last-login
  //if matched: change and create new password;
  //if email don't exist then create user;
  //create user with email and name, encypted password in db
  //create a new refresh: 1week and acccess: 15mins session-jwt.
  //Send back access_token
};

/* i might as well invest in this well! */
export const ForgotPasswordService = async (arg: IForgotPassword) => {
  //Send mails to users!
};
