import { createUserResolver, getUserResolver, signInUserResolver } from "./user.resolvers";

const userResolvers = {
  Query: {
    getUser: getUserResolver,
  },

  Mutation: {
    createUser: createUserResolver,
    signInUser : signInUserResolver
  },
};


export default userResolvers;
