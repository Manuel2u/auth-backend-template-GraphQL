import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const GENERATE_TOKEN = (user: any) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "",
    { expiresIn: "1d" }
  );

  const refresh_token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "",
    { expiresIn: "30d" }
  );

  return {access_token, refresh_token}
};

export default GENERATE_TOKEN;
