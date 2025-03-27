import bcrypt from "bcrypt";
import repositoryUser from "../repositories/repository.user.js";
import jwt from "../token.js";

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
  const user = await repositoryUser.ListarByEmailAdmin(email);

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

async function Listar() {
  const users = await repositoryUser.Listar();

  return users;
}

export default { Inserir, Login, Profile, InserirAdmin, LoginAdmin, Listar };
