const jwt = require("jsonwebtoken");
const SECRET = "VALIDAI_SECRET_2025";

function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: "No autorizado" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Token inválido" });
  }
}

module.exports = verifyToken;
