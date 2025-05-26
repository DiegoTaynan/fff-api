import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar certificados SSL
const privateKey = fs.readFileSync(
  "C:/Users/Administrator/Documents/Projetos/fff-api/certs/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "C:/Users/Administrator/Documents/Projetos/fff-api/certs/fullchain.pem",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(express.json());
app.use(cors());

// Middleware para remover cabeçalhos CSP duplicados
app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  next();
});

app.use((req, res, next) => {
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://familyfriendsadmin.com"],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com", // Google Fonts
          "https://cdn.jsdelivr.net", // Bootstrap Icons
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Necessário para estilos inline
          "https://fonts.googleapis.com", // Google Fonts
          "https://cdn.jsdelivr.net", // Bootstrap
        ],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'", // Necessário para estilos inline
          "https://fonts.googleapis.com", // Google Fonts
          "https://cdn.jsdelivr.net", // Bootstrap
        ],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://fff-storage-images.s3.us-east-2.amazonaws.com",
        ],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        objectSrc: ["'none'"],
        scriptSrcAttr: ["'none'"],
        upgradeInsecureRequests: [],
        reportUri: "/csp-violation-report", // Endpoint para relatórios de CSP
      },
    },
  })
);

// Endpoint para relatórios de CSP
app.post("/csp-violation-report", express.json(), (req, res) => {
  console.error("CSP Violation:", req.body);
  res.status(204).end();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Atualizando o caminho do build do React
const reactBuildPath = path.join(
  "C:/Users/Administrator/Documents/Projetos/fff-web"
);
app.use(express.static(reactBuildPath));

// Redirecionar HTTP para HTTPS
app.use((req, res, next) => {
  const isHttps = req.headers["x-forwarded-proto"] === "https";
  if (!isHttps && process.env.NODE_ENV === "production") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Proxy para imagens
app.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error fetching image");
  }
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
  console.log(
    `Servidor rodando com HTTPS para o aplicativo na porta: ${appPort}`
  );
});
