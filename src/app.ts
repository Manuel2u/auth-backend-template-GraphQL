import express from "express";
import customError from "./middleware/errorMiddleware";
import DB_CONNECT from "./config/dbConnect";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import verifyToken from "./middleware/authentication";
import { userMutation,userQuery } from "./schemas/user.schema";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(customError);

const ROOT_QUERY = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userQuery,
  },
});

const ROOT_MUTATION = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...userMutation,
  },
});

const schema = new GraphQLSchema({
  mutation: ROOT_MUTATION,
  query: ROOT_QUERY,
});

app.use(
  "/graphql",
  verifyToken,
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, async () => {
  try {
    await DB_CONNECT();
    console.log(`Server is Listening on Port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
