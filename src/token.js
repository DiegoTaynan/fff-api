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
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretToken); // Certifique-se de usar a mesma chave secreta
    req.id_user = decoded.id_user; // Adiciona o `id_user` ao objeto `req`
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default {
  CreateToken,
  ValidateToken,
};
