import {
  CreateUser,
  GetUser,
  UpdateUser,
} from "@/users/repository/users.repository";
import ValidationError from "@/utils/exceptions/validationError";
import bc from "bcrypt";
import jwt from "jsonwebtoken";
import { getResetToken, upsertToken } from "./repository/resetToken";
//LOGIN WITH PASSWORD
interface IAuth {
  email: string;
  password: string;
}

interface IResetPassword {
  userId?: string;
  email?: string;
  reset_token?: string;
  source: "forgot_password" | "change_password";
  old_password?: string;
  new_password?: string;
}

interface IForgotPassword {
  email: string;
}

interface ISignup extends IAuth {
  first_name: string;
  last_name?: string;
}

export const LoginWithEmailAndPassword = async (arg: IAuth) => {
  try {
    //check up email on db
    const user = await GetUser(arg.email, "email");

    //Check if email and password match with the one on db;
    if (!user.email || !bc.compare(arg.password, user.password)) {
      throw new ValidationError({}, "Invalid Email or Password");
    }

    //create a new token: 1d
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //Send back access_token
    return {
      token,
      user: { user_id: user.user_id, role: user.role, profile: user.profile },
    };
  } catch (e) {
    throw e;
  }
};

export const SignupWithEmailAndPassword = async (arg: ISignup) => {
  //check up email on db
  const user = await GetUser(arg.email, "email");

  //if email don't exist then create user;
  if (user.email) {
    throw new ValidationError({}, "Email already exist!");
  }

  //create user with email and name, encypted password in db
  const newuser = await CreateUser({
    email: arg.email,
    first_name: arg.first_name || arg.email.split("@")[0],
    last_name: arg.last_name || null,
    password: await bc.hash(arg.password, 10),
  });

  //create a new token: 1d
  const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  //Send back access_token
  return { token, user: newuser.user };
};

export const PasswordResetService = async (arg: IResetPassword) => {
  //get email from token
  const user = await GetUser(arg.email, "email");

  //1.Email is valid!
  if (arg.source === "forgot_password" && !user && !user?.email) {
    throw new ValidationError({}, "This email is not valid");
  }

  //2.compare old passwords (in db and from user)
  if (arg.source === "change_password" && user.password !== arg.old_password) {
    throw new ValidationError({}, "Your current password is not correct");
  }

  if (arg.source === "forgot_password") {
    //Validate if forget password token;
    const resetToken = await getResetToken(arg.email);

    if (resetToken.isUsed) {
      throw new ValidationError({}, "Token has already been used!");
    }

    //15mins
    if (!resetToken.expires_at || resetToken.expires_at > new Date()) {
      throw new ValidationError({}, "Token has expired!");
    }

    //Validate validity
    if (!resetToken.token || resetToken.token !== arg.reset_token) {
      throw new ValidationError({}, "Token is invalid!");
    }

    //Change it to used
    await upsertToken({
      email: arg.email,
      isUsed: true,
      expires_at: null,
      token: null,
    });
  }

  //if matched: change and create new password;
  const changepassword = await bc.hash(arg.new_password, 10);

  //Upload to db;
  const updateuser = await UpdateUser(user.user_id, {
    password: changepassword,
  });

  //User should be redirected to /login
  return updateuser;
};

/* i might as well invest in this well! */
export const ForgotPasswordService = async (arg: IForgotPassword) => {
  //Send mails to users!
  const user = await GetUser(arg.email, "email");

  if (!user) {
    throw new ValidationError({}, `${arg.email[0].toUpperCase()} is not found`);
  }

  const generateToken = "sometoken";
  const timeout = new Date(Date.now() + 15 * 60 * 1000);

  const data = await upsertToken({
    email: arg.email,
    isUsed: false,
    expires_at: timeout,
    token: generateToken,
  });

  //Email user
  //const sendEmail =
  return { data: "Password reset link has been sent to your registered email" };
};
