const Service = require("node-windows").Service;

const svc = new Service({
  name: "API FFF",
  description: "API com banco SQLite",
  script:
    "C:\\Users\\Administrator\\Documents\\Projetos\\fff-api\\src\\index.js",
});

svc.on("install", () => {
  svc.start();
});

svc.install();
