import serviceUser from "../services/service.user.js";
import jwt from "../token.js"; // Adicione esta linha para importar o módulo jwt

async function Inserir(req, res) {
  try {
    console.log("Body recebido:", req.body); // Adicionado log do corpo da requisição

    const {
      name,
      email,
      phone,
      password,
      address,
      complement,
      city,
      state,
      zipcode,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Missing required fields: name, email and password are required",
      });
    }

    console.log("Campos validados, iniciando processo de registro"); // Log de progresso

    const user = await serviceUser.Inserir(
      name,
      email,
      phone || "",
      password,
      address || "",
      complement || "",
      city || "",
      state || "",
      zipcode || ""
    );

    console.log("Usuário registrado com sucesso:", user.id_user); // Log de sucesso
    res.status(201).json(user);
  } catch (error) {
    console.error("Erro detalhado no registro de usuário:", error);
    // Retorna mensagem de erro mais detalhada
    res.status(500).json({
      error: error.message || "Ocorreu um erro durante o registro do usuário",
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
  }
}

async function Login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await serviceUser.Login(email, password);

    if (!user || user.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      id_user: user.id_user,
      name: user.name,
      email: user.email,
      token: user.token,
    });
  } catch (error) {
    console.error("Login error:", error); // Log detalhado para depuração
    res
      .status(500)
      .json({ error: "An unexpected error occurred during login" });
  }
}

async function Profile(req, res) {
  try {
    console.log("User ID in request:", req.id_user); // Log do ID do usuário no request
    const id_user = req.id_user;

    if (!id_user) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const user = await serviceUser.Profile(id_user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in Profile endpoint:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user profile" });
  }
}

async function InserirAdmin(req, res) {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      complement,
      city,
      state,
      zipcode,
    } = req.body;

    const user = await serviceUser.InserirAdmin(
      name,
      email,
      phone,
      password,
      address,
      complement,
      city,
      state,
      zipcode
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function LoginAdmin(req, res) {
  const { email, password } = req.body;

  try {
    const admin = await serviceUser.LoginAdmin(email, password);

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (admin.status === "rejected") {
      return res.status(403).json({ error: "Your account has been rejected." });
    }

    if (admin.status !== "approved") {
      return res
        .status(403)
        .json({ error: "Your account is not approved yet." });
    }

    res.status(200).json({
      id_admin: admin.id_admin,
      name: admin.name,
      email: admin.email,
      token: jwt.CreateToken(admin.id_admin),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An unexpected error occurred during login" });
  }
}

async function Listar(req, res) {
  const users = await serviceUser.Listar();

  res.status(200).json(users);
}

async function ListarPendentes(req, res) {
  try {
    const pendingUsers = await serviceUser.ListarPendentes(); // Ajuste conforme o serviço
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários pendentes" });
  }
}

// Aprova um usuário pendente
async function AprovarUsuario(req, res) {
  try {
    const { id_user } = req.params;
    const user = await serviceUser.AprovarUsuario(id_user); // Ajuste conforme o serviço
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json({ message: "Usuário aprovado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao aprovar usuário" });
  }
}

// Rejeita um usuário pendente
async function RejeitarUsuario(req, res) {
  try {
    const { id_user } = req.params;
    const user = await serviceUser.RejeitarUsuario(id_user); // Ajuste conforme o serviço
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json({ message: "Usuário rejeitado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao rejeitar usuário" });
  }
}

async function ListarAdmins(req, res) {
  try {
    const admins = await serviceUser.ListarAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Error fetching admins" });
  }
}

async function ListarAdminsPendentes(req, res) {
  try {
    const admins = await serviceUser.ListarAdminsPendentes();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending admins" });
  }
}

async function AtualizarStatusAdmin(req, res) {
  try {
    const { id_admin } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await serviceUser.AtualizarStatusAdmin(id_admin, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ message: `Admin ${status} successfully` });
  } catch (error) {
    res.status(500).json({ error: "Error updating admin status" });
  }
}

async function DeletarProfile(req, res) {
  try {
    const id_user = req.id_user;
    const result = await serviceUser.DeletarProfile(id_user);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the profile" });
  }
}

export default {
  Inserir,
  Login,
  Profile,
  InserirAdmin,
  LoginAdmin,
  Listar,
  ListarPendentes,
  AprovarUsuario,
  RejeitarUsuario,
  ListarAdmins,
  ListarAdminsPendentes,
  AtualizarStatusAdmin,
  DeletarProfile,
};
