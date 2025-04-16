import sqlite3 from "sqlite3";

const SQLite = sqlite3.verbose();

function query(command, params, method = "all") {
  return new Promise(function (resolve, reject) {
    if (method === "run") {
      db.run(command, params, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve({ changes: this.changes }); // Retorna o número de linhas afetadas
        }
      });
    } else {
      db[method](command, params, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
}

const db = new SQLite.Database(
  "./src/database/banco.db",
  SQLite.OPEN_READWRITE,
  (err) => {
    if (err) return;
  }
);

export { db, query };
