import sqlite3 from "sqlite3";

const SQLite = sqlite3.verbose();

function query(command, params, method = "all") {
  return new Promise(function (resolve, reject) {
    db[method](command, params, function (error, result) {
      if (error) {
        console.error("❌ Erro na query SQL:");
        console.error("Comando:", command);
        console.error("Parâmetros:", params);
        console.error("Erro:", error.message);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

const db = new SQLite.Database(
  "./src/database/banco.db",
  SQLite.OPEN_READWRITE,
  (err) => {
    if (err) return console.log("Error connecting to the bank: " + err.message);
  }
);

export { db, query };
