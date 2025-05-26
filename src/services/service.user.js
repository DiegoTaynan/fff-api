import bcrypt from "bcrypt";
import repositoryUser from "../repositories/repository.user.js";
import jwt from "../token.js";
import { query } from "../database/sqlite.js";

// Função temporária para verificar e-mail se o repositório não tiver implementado
async function verificarEmailExistente(email) {
  try {
    const sql = `SELECT id_user, name, email FROM users WHERE email = ?`;
    const user = await query(sql, [email]);

    if (user && user.length > 0) {
      return user[0];
    }
    return null;
  } catch (error) {
    return null; // Em caso de erro, assumimos que o e-mail não existe
  }
}

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
  try {
    // Verificar se o repositório tem a função necessária
    if (typeof repositoryUser.ListarByEmail !== "function") {
      console.error(
        "Erro crítico: ListarByEmail não é uma função",
        repositoryUser
      );
      throw new Error("Erro interno: configuração do repositório inválida");
    }

    // Validate email format using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Formato de e-mail inválido");
    }

    let validarUser;
    try {
      validarUser = await repositoryUser.ListarByEmail(email);

      if (validarUser && validarUser.id_user) {
        throw new Error("Já existe uma conta criada com este e-mail");
      }
    } catch (emailCheckError) {
      // Se o erro for específico sobre conta já existente, propague-o
      if (
        emailCheckError.message === "Já existe uma conta criada com este e-mail"
      ) {
        throw emailCheckError;
      }

      console.error("Erro ao verificar e-mail existente:", emailCheckError);
      // Se for um erro de função não encontrada, tente a alternativa
      if (emailCheckError.message.includes("is not a function")) {
        console.warn("Usando método alternativo de verificação de e-mail");
        validarUser = await verificarEmailExistente(email);

        if (validarUser && validarUser.id_user) {
          throw new Error("Já existe uma conta criada com este e-mail");
        }
      }
    }

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

    if (!user || !user.id_user) {
      throw new Error("Falha ao criar conta de usuário");
    }

    user.token = jwt.CreateToken(user.id_user);
    user.name = name;
    user.email = email;
    user.address = address;
    user.complement = complement;
    user.city = city;
    user.state = state;
    user.zipcode = zipcode;

    return user;
  } catch (error) {
    console.error("Service Inserir error:", error);
    throw error; // Re-throw para ser capturado pelo controlador
  }
}

async function Login(email, password) {
  try {
    const user = await repositoryUser.ListarByEmail(email);

    if (!user || user.length === 0) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    delete user.password;
    user.token = jwt.CreateToken(user.id_user);

    return user;
  } catch (error) {
    console.error("Service Login error:", error); // Log detalhado
    throw error;
  }
}

async function Profile(id_user) {
  try {
    if (!id_user) {
      throw new Error("User ID is missing");
    }

    const user = await repositoryUser.Profile(id_user);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Service Profile error:", error); // Log detalhado
    throw error;
  }
}

async function InserirAdmin(name, email, phone, password) {
  const validarUser = await repositoryUser.ListarByEmail(email);

  if (validarUser && validarUser.id_user)
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

async function DeletarProfile(id_user) {
  const result = await repositoryUser.DeletarProfile(id_user);

  if (result.affectedRows === 0) {
    throw new Error("User not found");
  }

  return result;
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
  DeletarProfile,
};
