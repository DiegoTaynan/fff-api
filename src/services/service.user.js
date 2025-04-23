import bcrypt from "bcrypt";
import repositoryUser from "../repositories/repository.user.js";
import jwt from "../token.js"; // Certifique-se de importar o módulo jwt corretamente

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
  const validarUser = await repositoryUser.ListarByEmail(email);

  if (validarUser.id_user)
    throw "There is already an account created with that email";

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await repositoryUser.Inserir(
    name,
    email,
    phone,
    hashPassword,
    address,
    complement,
    city,
    state,
    zipcode
  );

  user.token = jwt.CreateToken(user.id_user);
  user.name = name;
  user.email = email;
  user.address = address;
  user.complement = complement;
  user.city = city;
  user.state = state;
  user.zipcode = zipcode;

  return user;
}

async function Login(email, password) {
  const user = await repositoryUser.ListarByEmail(email);

  if (user.length == 0) return [];
  else {
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;

      user.token = jwt.CreateToken(user.id_user);

      return user;
    } else return [];
  }

  return user;
}

async function Profile(id_user) {
  const user = await repositoryUser.Profile(id_user);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function InserirAdmin(name, email, phone, password) {
  const validarUser = await repositoryUser.ListarByEmail(email);

  if (validarUser.id_user)
    throw "There is already an account created with that email";

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await repositoryUser.InserirAdmin(name, email, hashPassword);

  user.token = jwt.CreateToken(user.id_user);
  user.name = name;
  user.email = email;

  return user;
}

async function LoginAdmin(email, password) {
  try {
    const admin = await repositoryUser.ListarByEmailAdmin(email);

    if (!admin) {
      return null; // Admin não encontrado
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return null; // Senha inválida
    }

    return {
      id_admin: admin.id_admin,
      name: admin.name,
      email: admin.email,
      status: admin.status, // Retorna o status do administrador
    };
  } catch (error) {
    throw error; // Repassa o erro para o controlador
  }
}

async function Listar() {
  const users = await repositoryUser.Listar();

  return users;
}

async function RejeitarUsuario(id_user) {
  const user = await repositoryUser.RejeitarUsuario(id_user);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function ListarAdmins() {
  return await repositoryUser.ListarAdmins();
}

async function ListarAdminsPendentes() {
  return await repositoryUser.ListarAdminsPendentes();
}

async function AtualizarStatusAdmin(id_admin, status) {
  return await repositoryUser.AtualizarStatusAdmin(id_admin, status);
}

export default {
  Inserir,
  Login,
  Profile,
  InserirAdmin,
  LoginAdmin,
  Listar,
  RejeitarUsuario,
  ListarAdmins,
  ListarAdminsPendentes,
  AtualizarStatusAdmin,
};
