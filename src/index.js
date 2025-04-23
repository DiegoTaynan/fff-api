import dotenv from "dotenv";
dotenv.config(); // Ensure this is the first line to load environment variables

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
