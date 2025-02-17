const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // Extract the token from the Authorization header (Bearer token)
  const token = req.headers["authorization"]?.split(" ")[1];

  // If no token is provided, respond with a 403 Forbidden status
  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided." });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET || "secretKey", (err, decoded) => {
    // If the token is invalid or expired, respond with an error
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    // If the token is valid, attach the decoded user ID to the request object
    req.userId = decoded.id;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateUser;
