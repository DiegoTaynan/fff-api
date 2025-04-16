import serviceUser from "../services/service.user.js";

async function Inserir(req, res) {
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

    const user = await serviceUser.Inserir(
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

async function Login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await serviceUser.Login(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // Certifique-se de que o campo isAdmin existe no modelo
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during login" });
  }
}

async function Profile(req, res) {
  try {
    const id_user = req.id_user;
    const user = await serviceUser.Profile(id_user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
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

    if (admin.status === "rejected") {
      return res.status(403).json({ error: "Your account has been rejected." });
    }

    res.status(200).json({
      id: admin.id_admin,
      name: admin.name,
      email: admin.email,
      status: admin.status,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during login" });
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
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Error fetching admins" });
  }
}

async function ListarAdminsPendentes(req, res) {
  try {
    const admins = await serviceUser.ListarAdminsPendentes();
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching pending admins:", error);
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
    console.error("Error updating admin status:", error);
    res.status(500).json({ error: "Error updating admin status" });
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
};
