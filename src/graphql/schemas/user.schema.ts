// schema types
const typeDefs = `
input userInputs {
  fName: String!
  lName: String!
  username: String!
  email: String!
  password: String!
}

type User {
  id: String
  fName: String!
  lName: String!
  username: String!
  email: String!
  password: String!
  token : String
}

type newUser {
  user : User 
  access_token : String
}

type Query {
  getUser: User
}

type Mutation {
  createUser(input : userInputs!): newUser
}
`;

export { typeDefs}
