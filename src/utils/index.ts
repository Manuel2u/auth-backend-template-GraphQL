import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { signUpInfo } from "../types";

const signUpUser = async (info: signUpInfo, callback: any) => {
  bcrypt.hash(info.password, 10, async (err, hash) => {
    if (err) {
      throw new Error(`error : ${err}`);
    }

    const user = new User({
      fName: info.fName,
      lName: info.lName,
      username: info.username,
      email: info.email,
      password: hash,
    });

    const savedUser = await user.save();
    callback(null, savedUser);
  });
};

export {signUpUser}