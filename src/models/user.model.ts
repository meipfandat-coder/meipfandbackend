import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum:['admin' , 'donor' , 'collector'], required: true },
    refreshToken: { type: String },
    forgotToken: { type: String },
  },
  { timestamps: true }
);

const preRegisterUserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, default: null },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum:['admin' , 'donor' , 'collector'], required: true },
    verifyToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password") && !this.isNew) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

preRegisterUserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  if (this.isNew) {
    if (!this._id) {
      this._id = new mongoose.Types.ObjectId();
    }
    this.verifyToken = jwt.sign({ _id: this._id }, config.VerifyTokenSecret, {
      expiresIn: 60*60,
    });
  }
  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  this.refreshToken = jwt.sign(
    { email: this.email },
    config.RefreshTokenSecret,
    {
      expiresIn: 24 * 60 * 60,
    }
  );
  return this.refreshToken;
};

userSchema.methods.generateForgotToken = function () {
  this.forgotToken = jwt.sign({ _id: this._id }, config.ForgotTokenSecret, {
    expiresIn: 60 * 60 * 60,
  });
  return this.forgotToken;
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ email: this.email, _id: this._id }, config.AccessTokenSecret, {
    expiresIn: 60 * 60,
  });
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const PreRegisterUser =
  mongoose.models.PreRegisterUser ||
  mongoose.model("PreRegisterUser", preRegisterUserSchema);
