import jwt from "jsonwebtoken";

const secretToken = "ffF@m!ly";

function CreateToken(id_user) {
  const token = jwt.sign({ id_user }, secretToken, {
    expiresIn: 9999999,
  });

  return token;
}

function ValidateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Token not provided or invalid format");
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretToken);
    req.id_user = decoded.id_user; // Adiciona o `id_user` ao objeto `req`
    next();
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default {
  CreateToken,
  ValidateToken,
};
