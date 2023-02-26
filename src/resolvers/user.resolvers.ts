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
      const info = { fName, lName, email, username, password };
  
      if (!email || !username || !password || !fName || !lName) {
        throw new Error("Make sure all inputs are valid");
      }
  
      const alreadyExistingUser = await User.findOne({ email: email });
  
      const alreadyExistingUser_2 = await User.findOne({ username: username });
  
      if (alreadyExistingUser || alreadyExistingUser_2) {
        throw new Error("User already exists");
      }
  
      const user : any = await new Promise((resolve, reject) => {
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
  
      return { id: user._id, fName: user.fName, lName: user.lName, email: user.email, username: user.username, password: user.password, token: user.token, access_token };
    } catch (err) {
      throw err;
    }
  };
  

const getUserResolver = async ({ id }: { id: string }) => {
  const user = await User.find({ _id: id });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export { createUserResolver, getUserResolver };
