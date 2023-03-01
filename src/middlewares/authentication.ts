import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";


const verifyToken =  async ({ req } : any) => {
  let token = req.headers.authorization?.split(" ")[1] ?? "";

  try {
    if (token) {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      );

      if (decoded.exp < Date.now() / 1000) {
        throw new GraphQLError("Token Expired");
      }

      const { id } = decoded;
      return { id };
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Unauthorized access");
  }
}

export default verifyToken;
