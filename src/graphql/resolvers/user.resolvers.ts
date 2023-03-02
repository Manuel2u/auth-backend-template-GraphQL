import User from "../../models/user.model";
import GENERATE_TOKEN from "../../utils/token";
import { signInUser, signUpUser } from "../../utils";
import { GraphQLError } from "graphql";
import { ApolloError } from "apollo-server-errors";

const createUserResolver = async (parent: any, args: any) => {
  try {
    const { fName, lName, username, email, password } = args.input;

    const info = { fName, lName, email, username, password };

    if (!email || !username || !password || !fName || !lName) {
      throw new GraphQLError("Make sure all inputs are valid");
    }

    const alreadyExistingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (alreadyExistingUser) {
      throw new GraphQLError("User already exists");
    }

    const user = await signUpUser(info);
    const { access_token, refresh_token } = GENERATE_TOKEN(user);
    user.token = refresh_token;

    await user.save();

    return {
      user,
      access_token,
    };
  } catch (err) {
    throw new GraphQLError(`${err}`);
  }
};

const getUserResolver = async (parent: any, args: any, { id }: any) => {
  if (!id) {
    throw new GraphQLError("Unauthorized access");
  }

  const user = await User.find({ _id: id });

  if (!user) {
    throw new GraphQLError("User not found");
  }

  return user;
};

const signInUserResolver = async (parent: any, args: any, context: any) => {
  try {
    const { email_username, password } = args.input;
    const info = { email_username, password };

    if (!email_username || !password) {
      throw new GraphQLError("Make sure all inputs are right");
    }
    const user = await signInUser(info);

    return { user };
  } catch (err) {
    throw new GraphQLError(`${err}`);
  }
};

export { createUserResolver, getUserResolver, signInUserResolver };
