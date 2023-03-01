import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { signInInfo, signUpInfo } from "../types";
import { GraphQLError } from "graphql";

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

const signInUser = async (info: signInInfo, callbck: any) => {
  try {
    const foundUser_by_email_or_username = await User.findOne(
      { email: info.email_username } || { username: info.email_username }
    );

    if (foundUser_by_email_or_username) {
      bcrypt.compare(
        info.password,
        foundUser_by_email_or_username?.password || "",
        (err, success) => {
          if (success) {
            callbck(null, foundUser_by_email_or_username);
          }
        }
      );
    } else {
      throw new GraphQLError("User not found");
    }
  } catch (err) {
    throw new GraphQLError(`${err}`);
  }
};

export { signUpUser, signInUser };
