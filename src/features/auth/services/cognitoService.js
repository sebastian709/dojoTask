import {
  signUp,
  confirmSignUp,
  signIn,
  resendSignUpCode,
  signOut 
} from "aws-amplify/auth";

export const registerUser = async (email, password) => {
  return await signUp({
    username: email,
    password,
    options: {
      userAttributes: { email },
    },
  });
};

export const confirmUser = async (email, code) => {
  return await confirmSignUp({
    username: email,
    confirmationCode: code,
  });
};

export const loginUser = async (email, password) => {
  return await signIn({
    username: email,
    password,
  });
};

export const resendOTP = async (email) => {
  return await resendSignUpCode({
    username: email,
  });
};

export const logoutUser = async () => {
  return await signOut();
};