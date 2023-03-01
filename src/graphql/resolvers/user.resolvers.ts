import User from "../../models/user.model";
import GENERATE_TOKEN from "../../utils/token";
import { signInUser, signUpUser } from "../../utils";

const createUserResolver = async (
  parent: any,
  args: any,
  contextValue: any
) => {
  try {
    const { fName, lName, username, email, password } = args.input;

    const info = { fName, lName, email, username, password };

    if (!email || !username || !password || !fName || !lName) {
      throw new Error("Make sure all inputs are valid");
    }

    const alreadyExistingUser = await User.findOne({ email: email });

    const alreadyExistingUser_2 = await User.findOne({ username: username });

    if (alreadyExistingUser || alreadyExistingUser_2) {
      throw new Error("User already exists");
    }

    const user: any = await new Promise((resolve, reject) => {
      signUpUser(info, (err: any, user: any) => {
        if (err) {
          reject(new Error(`${err}`));
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
    throw new Error("Unauthorized access");
  }

  const user = await User.find({ _id: id });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const signInUserResolver = async (parent: any, args: any, context: any) => {
  try {
    const { email_username, password } = args.input;
    const info = { email_username, password };

    if (!email_username || !password) {
      throw new Error("Make sure all inputs are right");
    }

    const user = await new Promise((resolve, reject) => {
      signInUser(info, (err: any, user: any) => {
        if (err) {
          reject(new Error("Wrong email/username or password"));
        } else {
          resolve(user);
        }
      });
    });
    return { user };
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export { createUserResolver, getUserResolver, signInUserResolver };
