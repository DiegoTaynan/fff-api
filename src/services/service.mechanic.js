import repositoryMechanic from "../repositories/repository.mechanic.js";

async function Listar(name) {
  const mechanic = await repositoryMechanic.Listar(name);

  return mechanic;
}

async function Inserir(name, specialty, icon) {
  const mechanic = await repositoryMechanic.Inserir(name, specialty, icon);

  return mechanic;
}

async function Editar(id_mechanic, name, specialty, icon) {
  const mechanic = await repositoryMechanic.Editar(
    id_mechanic,
    name,
    specialty,
    icon
  );
  return mechanic;
}

async function Excluir(id_mechanic) {
  const mechanic = await repositoryMechanic.Excluir(id_mechanic);
  return mechanic;
}

// // Função para verificar disponibilidade de mecânicos
// async function CheckAvailability(date, hour) {
//   const availableMechanics = await repositoryMechanic.CheckAvailability(
//     date,
//     hour
//   );
//   return availableMechanics;
// }

async function CheckAvailability(date, hour) {
  // Chamar o repositório para buscar mecânicos disponíveis
  const availableMechanics = await repositoryMechanic.CheckAvailability(
    date,
    hour
  );
  return availableMechanics;
}

export default { Listar, Inserir, Editar, Excluir, CheckAvailability };
