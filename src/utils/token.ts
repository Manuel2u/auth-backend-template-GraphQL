import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const GENERATE_TOKEN = (user: any) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "",
    { expiresIn: "1d" }
  );

  const resfresh_token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "",
    { expiresIn: "30d" }
  );
};

export default GENERATE_TOKEN;
