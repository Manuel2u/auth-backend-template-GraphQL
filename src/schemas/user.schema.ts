// schema types
const typeDefs = `
type User {
  id: String
  fName: String!
  lName: String!
  username: String!
  email: String!
  password: String!
  token : String
}

type Query {
  user: User
}

type Mutation {
  createUser(fName: String, lName: String, email: String, username: String, password: String): User
}
`;

export { typeDefs}
