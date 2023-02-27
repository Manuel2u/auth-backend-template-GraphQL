import jwt from "jsonwebtoken";

interface MyContext {
  req: any; 
}

const verifyToken = ({ req }: MyContext) => {
  let token;

  try {
    token = req.headers.authorization?.split(" ")[1];

    const decoded: any = jwt.verify(token || "", process.env.JWT_SECRET || "");

    if (decoded.exp < Date.now() / 1000) {
      throw new Error("Token Expired");
    }

    req.user = decoded;
  } catch (err) {
    throw new Error("Unauthorized access");
  }
  if (!token) {
    throw new Error("Unauthorized access");
  }
};

export default verifyToken;
