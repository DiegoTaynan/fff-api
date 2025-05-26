import sqlite3 from "sqlite3";

const SQLite = sqlite3.verbose();

function query(command, params, method = "all") {
  return new Promise(function (resolve, reject) {
    try {
      if (method === "run") {
        db.run(command, params, function (error) {
          if (error) {
            console.error("DB Error (run):", error);
            reject(error);
          } else {
            resolve({ changes: this.changes }); // Retorna o número de linhas afetadas
          }
        });
      } else {
        db[method](command, params, function (error, result) {
          if (error) {
            console.error("DB Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        });
      }
    } catch (error) {
      console.error("Erro crítico na execução da query:", error);
      reject(error);
    }
  });
}

const db = new SQLite.Database(
  //"./src/database/banco.db",
  "C:\\Users\\Administrator\\Documents\\Projetos\\fff-api\\src\\database\\banco.db",
  SQLite.OPEN_READWRITE,
  (err) => {
    if (err) return;
  }
);

export { db, query };
