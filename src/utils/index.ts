import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { signInInfo, signUpInfo } from "../types";
import { GraphQLError } from "graphql";
import { ApolloError } from "apollo-server-errors";

const signUpUser = async (info: signUpInfo) => {
  const hash = await bcrypt.hash(info.password, 10);
  if (!hash) {
    throw new GraphQLError(`there was an error signing user up`);
  }

  const user = new User({
    fName: info.fName,
    lName: info.lName,
    username: info.username,
    email: info.email,
    password: hash,
  });

  const savedUser = await user.save();
  return savedUser;
};

const signInUser = async (info: signInInfo) => {
  try {
    const { password, email_username } = info;
    const user = await User.findOne({
      $or: [{ username: email_username }, { email: email_username }],
    });

    if (!user) return new GraphQLError("wrong email or username");

    const isPasswordmatch = await bcrypt.compare(password, user?.password);

    if (!isPasswordmatch) return new GraphQLError("wrong password");

    return user;
  } catch (error) {
    throw new GraphQLError(`${error}`);
  }
};

export { signUpUser, signInUser };
