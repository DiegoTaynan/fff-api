import dotenv from "dotenv";
dotenv.config(); // Ensure this is the first line to load environment variables

import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar certificados SSL
const privateKey = fs.readFileSync("C:/Users/Administrator/Documents/Projetos/fff-api/certs/privkey.pem", "utf8");
const certificate = fs.readFileSync("C:/Users/Administrator/Documents/Projetos/fff-api/certs/fullchain.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://familyfriendsadmin.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
        ],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  })
);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Atualizando o caminho do build do React
const reactBuildPath = path.join(
  "C:/Users/Administrator/Documents/Projetos/fff-web"
);
app.use(express.static(reactBuildPath));

app.use((req, res, next) => {
  const isHttps = req.headers["x-forwarded-proto"] === "https";
  if (!isHttps && process.env.NODE_ENV === "production") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use(router);

// Rota para servir o React em todas as rotas não-API
app.get("*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

// Porta para o IIS (backend interno)
const backendPort = process.env.BACKEND_PORT || 3001;

// Porta para o aplicativo (conexão direta via HTTPS)
const appPort = process.env.APP_PORT || 3002;

// Servidor para o IIS
app.listen(backendPort, () => {
  console.log(`Servidor rodando na porta interna para o IIS: ${backendPort}`);
});

// Servidor HTTPS para o aplicativo
https.createServer(credentials, app).listen(appPort, () => {
  console.log(`Servidor rodando com HTTPS para o aplicativo na porta: ${appPort}`);
});
