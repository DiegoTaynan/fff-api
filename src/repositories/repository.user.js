import { query } from "../database/sqlite.js";

async function Inserir(
  name,
  email,
  phone,
  password,
  address,
  complement,
  city,
  state,
  zipcode
) {
  let sql = `insert into users(name, email, phone, password, address,
   complement, city, state, zipcode ) values(?, ?, ?, ?, ?, ?, ?, ?, ?)
    returning id_user`;

  const user = await query(sql, [
    name,
    email,
    phone,
    password,
    address,
    complement,
    city,
    state,
    zipcode,
  ]);

  return user[0];
}

async function ListarByEmail(email) {
  // let sql = `select * from users where email = ?`;

  let sql = `select id_user, name, email, phone, password, address,
   complement, city, state, zipcode
   from users
   where email = ?`;

  const user = await query(sql, [email]);

  if (user.length == 0) return [];
  else return user[0];
}

async function Profile(id_user) {
  let sql = `select id_user, name, email, phone, address, complement, city, state, zipcode from users where id_user = ?`;

  const user = await query(sql, [id_user]);

  return user[0];
}

async function InserirAdmin(name, email, phone, password) {
  let sql = `insert into admins(name, email, password) 
    values(?, ?, ?)
    returning id_admin`;

  const user = await query(sql, [name, email, phone, password]);

  return user[0];
}

async function ListarByEmailAdmin(email) {
  // let sql = `select * from users where email = ?`;

  let sql = `select * from admins where email = ?`;

  const user = await query(sql, [email]);

  if (user.length == 0) return [];
  else return user[0];
}

async function Listar() {
  let sql = `select id_user, name, email from users order by name`;

  const users = await query(sql, []);

  return users;
}

export default {
  Inserir,
  ListarByEmail,
  Profile,
  InserirAdmin,
  ListarByEmailAdmin,
  Listar,
};
