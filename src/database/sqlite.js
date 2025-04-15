import sqlite3 from "sqlite3";

const SQLite = sqlite3.verbose();

function query(command, params, method = "all") {
  return new Promise(function (resolve, reject) {
    if (method === "run") {
      db.run(command, params, function (error) {
        if (error) {
          console.error("SQL Error:", error.message); // Log do erro SQL
          reject(error);
        } else {
          console.log("SQL Run Success:", { changes: this.changes }); // Log do sucesso da query
          resolve({ changes: this.changes }); // Retorna o número de linhas afetadas
        }
      });
    } else {
      db[method](command, params, function (error, result) {
        if (error) {
          console.error("SQL Error:", error.message); // Log do erro SQL
          reject(error);
        } else {
          console.log("SQL Query Success:", result); // Log do sucesso da query
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
    if (err)
      return console.log("Error connecting to the bank: " + err, message);
  }
);

export { db, query };
