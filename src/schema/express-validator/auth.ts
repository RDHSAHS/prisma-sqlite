import type { Schema } from "express-validator";

export const RegisterAuthSchema: Schema = {
  email: {
    in: "body",
    trim: true,
    isString: true,
    isEmail: {
      errorMessage: "Input correct email format",
    },
    isLength: {
      options: {
        min: 4,
        max: 50,
      },
      errorMessage: "Email should be minimum 4 and maximum 50 characters",
    },
    errorMessage: "Email must be filled",
  },
  username: {
    in: "body",
    trim: true,
    isString: true,
    isLength: {
      options: {
        min: 4,
        max: 50,
      },
      errorMessage: "Username should be minimum 4 and maximum 50 characters",
    },
    errorMessage: "Username must be filled",
  },
  password: {
    in: "body",
    isString: true,
    isStrongPassword: {
      errorMessage:
        "Password should include uppercase, lowercase, number, and special character",
    },
    isLength: {
      options: {
        min: 4,
        max: 50,
      },
      errorMessage: "Password should be minimum 4 and maximum 50 characters",
    },
    errorMessage: "Password must be filled",
  },
};

export const LoginAuthSchema: Schema = {
  identifier: {
    in: "body",
    trim: true,
    isString: true,
    errorMessage: "Identifier must be filled",
  },
  password: {
    in: "body",
    trim: true,
    isString: true,
    isLength: {
      options: {
        min: 4,
        max: 50,
      },
      errorMessage: "Password should be minimum 4 and maximum 50 characters",
    },
    errorMessage: "Password must be filled",
  },
};
