import DB_CONNECT from "./config/dbConnect";
import { typeDefs as userTypeDefs } from "./graphql/schemas/user.schema";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "../src/graphql/resolvers/index";
import userResolvers from "../src/graphql/resolvers/index";
// const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs : [userTypeDefs],
  resolvers : [userResolvers]
});

const startServer = async () => {
  try {
    await DB_CONNECT();
    const { url } = await startStandaloneServer(server, {
      listen: { port: 5000 },
    });
    console.log(`server is running on this url : ${url}`)
  } catch (err) {
    console.log(err);
  }
};

startServer()