import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { signUpInfo } from "../types";

const signUpUser = async (info: signUpInfo, callback: any) => {
  bcrypt.hash(info.password, 10, async (err: any, hash) => {
    if (err) {
      throw new Error("there was an error hashing your password");
    }
    const user = new User({
      firstName: info.fName,
      lastName: info.lName,
      email: info.email,
      userName: info.username,
      password: hash,
    });

    const response = await user.save();
    callback(null, response);
  });
};

export {signUpUser}