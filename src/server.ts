import DB_CONNECT from "./config/dbConnect";
import { typeDefs as userTypeDefs } from "./graphql/schemas/user.schema";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import userResolvers from "../src/graphql/resolvers/index";
import dotenv from "dotenv";
dotenv.config();
import verifyToken from "./middlewares/authentication";
const port = Number.parseInt(process.env.PORT || "") || 5000;


//creating a new apollo-server instance
const server = new ApolloServer({
  typeDefs: [userTypeDefs],
  resolvers: [userResolvers],
  formatError: (error) => {
    const { message, extensions } = error;
    if (extensions) {
      const { code } = extensions;
      if (code) {
        return { message, extensions };
      }
    }
    return {
      message: "An error occurred",
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  },
});
  

// a function to connect db and and create a stand alone server
const startServer = async () => {
  try {
    // connecting db
    await DB_CONNECT();
    const { url } = await startStandaloneServer(server, {
      context: ({req}) => verifyToken({req}),
      listen: { port },
    });
    console.log(`server is running on this url : ${url}`);
  } catch (err) {
    // catch error
    console.log(err);
  }
};

startServer();
