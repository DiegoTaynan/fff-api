import { query } from "../database/sqlite.js";

async function Listar(name) {
  let filtro = [];

  let sql = "select * from mechanic ";

  if (name) {
    sql = sql + "where name like ? ";
    filtro.push("%" + name + "%");
  }

  sql = sql + "order by name";

  const mechanic = await query(sql, filtro);

  return mechanic;
}

async function Inserir(name, specialty, icon) {
  let sql = `insert into mechanic(name, specialty, icon) values(?, ?, ?)
    returning id_mechanic`;

  const mechanic = await query(sql, [name, specialty, icon]);

  return mechanic[0];
}

async function Editar(id_mechanic, name, specialty, icon) {
  let sql = `update mechanic set name=?, specialty=?, icon=?
where id_mechanic = ?`;

  await query(sql, [name, specialty, icon, id_mechanic]);

  return { id_mechanic };
}

async function Excluir(id_mechanic) {
  let sql = `delete from mechanic where id_mechanic = ?`;

  await query(sql, [id_mechanic]);

  return { id_mechanic };
}

// // Verificar disponibilidade de mecânicos
// async function CheckAvailability(date, hour) {
//   const sql = `
//     SELECT * FROM mechanic
//     WHERE id_mechanic NOT IN (
//       SELECT id_mechanic FROM appointments
//       WHERE booking_date = ? AND booking_hour = ?
//     )
//   `;
//   const availableMechanics = await query(sql, [date, hour]);
//   return availableMechanics;
// }

async function CheckAvailability(date, hour) {
  const sql = `
    SELECT * FROM mechanic
    WHERE id_mechanic NOT IN (
      SELECT id_mechanic FROM appointments
      WHERE booking_date = ? AND booking_hour = ?
    )
  `;
  const availableMechanics = await query(sql, [date, hour]);
  return availableMechanics;
}

export default { Listar, Inserir, Editar, Excluir, CheckAvailability };
