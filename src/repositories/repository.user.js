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
  try {
    const sql = `SELECT id_user, name, email, password FROM users WHERE email = ?`;
    const user = await query(sql, [email]);

    if (user.length === 0) return null; // Retorna null se nenhum usuário for encontrado
    return user[0]; // Retorna o primeiro usuário encontrado
  } catch (error) {
    console.error("Repository ListarByEmail error:", error); // Log detalhado
    throw error; // Repassa o erro para o serviço
  }
}

async function Profile(id_user) {
  try {
    const sql = `SELECT id_user, name, email, phone, address, complement, city, state, zipcode FROM users WHERE id_user = ?`;
    const user = await query(sql, [id_user]);

    if (user.length === 0) return null; // Retorna null se nenhum usuário for encontrado
    return user[0]; // Retorna o perfil do usuário
  } catch (error) {
    console.error("Repository Profile error:", error); // Log detalhado
    throw error; // Repassa o erro para o serviço
  }
}

async function InserirAdmin(name, email, phone, password) {
  let sql = `insert into admins(name, email, password) 
    values(?, ?, ?)
    returning id_admin`;

  const user = await query(sql, [name, email, phone, password]);

  return user[0];
}

async function ListarByEmailAdmin(email) {
  let sql = `SELECT id_admin, name, email, password, status FROM admins WHERE email = ?`;

  const admin = await query(sql, [email]);

  if (admin.length === 0) return null;
  return admin[0];
}

async function Listar() {
  let sql = `select id_user, name, email from users order by name`;

  const users = await query(sql, []);

  return users;
}

async function RejeitarUsuario(id_user) {
  let sql = `DELETE FROM users WHERE id_user = ?`;
  const result = await query(sql, [id_user]);
  return result;
}

async function ListarAdmins() {
  let sql = `SELECT id_admin, name, email, status FROM admins ORDER BY name`;
  const admins = await query(sql, []);
  return admins;
}

async function ListarAdminsPendentes() {
  let sql = `SELECT id_admin, name, email FROM admins WHERE status = 'pending' ORDER BY name`;
  const admins = await query(sql, []);
  return admins;
}

async function AtualizarStatusAdmin(id_admin, status) {
  let sql = `UPDATE admins SET status = ? WHERE id_admin = ?`;
  const result = await query(sql, [status, id_admin]);
  return result;
}

async function DeletarProfile(id_user) {
  let sql = `DELETE FROM users WHERE id_user = ?`;
  const result = await query(sql, [id_user]);
  return result;
}

export default {
  Inserir,
  ListarByEmail,
  Profile,
  InserirAdmin,
  ListarByEmailAdmin,
  Listar,
  RejeitarUsuario,
  ListarAdmins,
  ListarAdminsPendentes,
  AtualizarStatusAdmin,
  DeletarProfile,
};
