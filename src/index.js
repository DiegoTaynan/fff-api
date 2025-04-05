import dotenv from "dotenv";
dotenv.config(); // Carrega o arquivo .env

console.log("Carregando variáveis de ambiente no index.js...");
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log(
  "AWS_ACCESS_KEY_ID:",
  process.env.AWS_ACCESS_KEY_ID ? "OK" : "MISSING"
);
console.log(
  "AWS_SECRET_ACCESS_KEY:",
  process.env.AWS_SECRET_ACCESS_KEY ? "OK" : "MISSING"
);
console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);

console.log("Importando outros módulos...");

import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
      },
    },
  })
);
app.use(router);

app.listen(3001, () => {
  console.log("Servidor rodando na porta: 3001");
});
