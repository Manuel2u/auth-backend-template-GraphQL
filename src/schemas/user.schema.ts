// import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";

// const userType = new GraphQLObjectType({
//   name: "User",
//   fields: () => ({
//     id: { type: GraphQLString },
//     fName: { type: GraphQLString },
//     lName: { type: GraphQLString },
//     username: { type: GraphQLString },
//     email: { type: GraphQLString },
//     password: { type: GraphQLString },
//   }),
// });

const typeDefs = `
type User {
  id: String
  fName: String!
  lName: String!
  username: String!
  email: String!
  password: String!
}

type Query {
  user: User
}

type Mutation {
  createUser(fName: String, lName: String, email: String, username: String, password: String): User
}
`;
// const userQuery = {
//   getUser: {
//     type: userType,
//     args: {
//       id: { type: new GraphQLNonNull(GraphQLString) },
//     },
//     async resolve(parent: any, args: any) {
//       return args;
//     },
//   },
// };



export { typeDefs}
// export { userMutation, userType, userQuery };
