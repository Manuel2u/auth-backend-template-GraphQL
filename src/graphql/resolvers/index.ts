import { createUserResolver, getUserResolver } from "./user.resolvers";

const userResolvers = {
  Query: {
    getUser: getUserResolver,
  },

  Mutation: {
    createUser: createUserResolver,
  },
};

export default userResolvers;
