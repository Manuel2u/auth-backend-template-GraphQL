import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";
import User from "../models/user.model";
import GENERATE_TOKEN from "../utils/token";
import { signUpUser } from "../utils";

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    fName: { type: GraphQLString },
    lName: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const userMutation = {
  createUser: {
    type: userType,
    args: {
      fName: { type: new GraphQLNonNull(GraphQLString) },
      lName: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent: any, args: any, context: any) {
      try {
        const { fName, lName, email, username, password } = args;

        const info = { fName, lName, email, username, password };

        if (!email || !username || !password || !fName || !lName) {
          throw new Error("Make sure all inputs are valid");
        }

        const alreadyExistingUser = await User.findOne({ email: email });

        const alreadyExistingUser_2 = await User.findOne({ email: email });

        if (alreadyExistingUser || alreadyExistingUser_2) {
          throw new Error("User already exists");
        }

        signUpUser(info, async (err: any, user: any) => {
          if (err) {
            throw new Error(`${err}`);
          }

          const { access_token, refresh_token } = GENERATE_TOKEN(user);

          user.token = refresh_token;
          await user.save();

          // Set the access token as a cookie in the response object
          context.response.cookie("access_token", access_token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          // Return the created user object
          return user;
        });
      } catch (err) {
        throw err;
      }
    },
  },
};

export { userMutation, userType };
