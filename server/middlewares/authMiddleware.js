import jwt from "jsonwebtoken";
import MESSAGES from "../constants/messages.js";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: MESSAGES.NO_TOKEN_PROVIDED });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: MESSAGES.INVALID_TOKEN });
  }
};

export { verifyToken };
