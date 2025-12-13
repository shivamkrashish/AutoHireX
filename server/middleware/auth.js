import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // 👉 "Bearer xyz" se sirf xyz nikalna
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }

    // Attach user to request (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};
