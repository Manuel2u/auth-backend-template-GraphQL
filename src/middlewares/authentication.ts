import jwt from "jsonwebtoken";


const verifyToken =  async ({ req } : any) => {
  let token = req.headers.authorization?.split(" ")[1] ?? "";

  try {
    if (token) {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      );

      if (decoded.exp < Date.now() / 1000) {
        throw new Error("Token Expired");
      }

      const { id } = decoded;
      return { id };
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw new Error("Unauthorized access");
  }
}

export default verifyToken;
