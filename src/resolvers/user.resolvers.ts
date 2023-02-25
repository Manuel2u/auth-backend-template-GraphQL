import User from "../models/user.model";
import GENERATE_TOKEN from "../utils/token";
import { signUpUser } from "../utils";

const createUserResolver = async ({
  fName,
  lName,
  email,
  username,
  password,
}: {
  fName: string;
  lName: string;
  email: string;
  username: string;
  password: string;
}) => {
  try {
    // const { fName, lName, email, username, password } = args;

    const info = { fName, lName, email, username, password };

    if (!email || !username || !password || !fName || !lName) {
      throw new Error("Make sure all inputs are valid");
    }

    const alreadyExistingUser = await User.findOne({ email: email });

    const alreadyExistingUser_2 = await User.findOne({
      userName: username,
    });

    if (alreadyExistingUser || alreadyExistingUser_2) {
      throw new Error("User already exists");
    }

    await signUpUser(info, async (err: any, user: any) => {
      if (err) {
        throw new Error(`${err}`);
      }

      const { access_token, refresh_token } = GENERATE_TOKEN(user);

      user.token = refresh_token;
      await user.save();

      // Set the access token as a cookie in the response object
      //   context.response.cookie("access_token", access_token, {
      //     maxAge: 24 * 60 * 60 * 1000, // 1 day
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === "production",
      //   });

      // Return the created user object
      return { user, access_token };
    });
  } catch (err) {
    throw err;
  }
};

const getUserResolver = async ({id} : {id : string}) => {
    const user =  await User.find({_id : id});

    if(!user){
        throw new Error("User not found")
    }

    return user
}

export {createUserResolver, getUserResolver};
