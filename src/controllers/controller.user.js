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

  const user = await serviceUser.Login(email, password);

  if (user.length == 0)
    res.status(401).json({ error: "Invalid email or password" });
  else res.status(200).json(user);
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

  const user = await serviceUser.LoginAdmin(email, password);

  if (user.length == 0)
    res.status(401).json({ error: "Invalid email or password" });
  else res.status(200).json(user);
}

async function Listar(req, res) {
  const users = await serviceUser.Listar();

  res.status(200).json(users);
}

export default { Inserir, Login, Profile, InserirAdmin, LoginAdmin, Listar };
