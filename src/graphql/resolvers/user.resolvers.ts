import User from "../../models/user.model";
import GENERATE_TOKEN from "../../utils/token";
import { signInUser, signUpUser } from "../../utils";
import { GraphQLError } from "graphql";
import { ApolloError } from "apollo-server-errors";

const createUserResolver = async (
  parent: any,
  args: any,
  contextValue: any
) => {
  try {
    const { fName, lName, username, email, password } = args.input;

    const info = { fName, lName, email, username, password };

    if (!email || !username || !password || !fName || !lName) {
      throw new GraphQLError("Make sure all inputs are valid");
    }

    const alreadyExistingUser = await User.findOne({ email: email });

    const alreadyExistingUser_2 = await User.findOne({ username: username });

    if (alreadyExistingUser || alreadyExistingUser_2) {
      throw new GraphQLError("User already exists");
    }

    const user: any = await new Promise((resolve, reject) => {
      signUpUser(info, (err: any, user: any) => {
        if (err) {
          reject(new GraphQLError(`${err}`, { extensions: { code: "Erorr" } }));
        } else {
          resolve(user);
        }
      });
    });

    const { access_token, refresh_token } = GENERATE_TOKEN(user);

    user.token = refresh_token;
    await user.save();

    return {
      user,
      access_token,
    };
  } catch (err) {
    throw err;
  }
};

const getUserResolver = async (parent: any, args: any, { id }: any) => {
  if (!id) {
    throw new GraphQLError("Unauthorized access");
  }

  const user = await User.find({ _id: id });

  if (!user) {
    // throw new GraphQLError("User not found");
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

    const user = await new Promise((resolve, reject) => {
      signInUser(info, (err: any, user: any) => {
        if (err) {
          reject(new GraphQLError("Wrong email/username or password"));
        } else {
          resolve(user);
        }
      });
    });

    return { user };
  } catch (err) {
    throw new GraphQLError(`${err}`, {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
};

export { createUserResolver, getUserResolver, signInUserResolver };
