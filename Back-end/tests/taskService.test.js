const { addTask, deleteTask, updateTask } = require("../services/taskService");

jest.mock("../models/taskModels");

let taskModel;
describe("addTask", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    taskModel = require("../models/taskModels");
  });

  it("Doit ajouter une tâche", async () => {
    taskModel.create.mockResolvedValue();

    await addTask("Faire les courses", 45);

    expect(taskModel.create).toHaveBeenCalledWith({
      description: "Faire les courses",
      userId: 45,
    });
  });

  it("lance une erreur si la description est vide", async () => {
    await expect(addTask("", 45)).rejects.toThrow("Description manquante.");
    expect(taskModel.create).not.toHaveBeenCalled();
  });
});

describe("deleteTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Vérifie si taskModel est appelée avec les bons paramètres", async () => {
    taskModel.delete.mockResolvedValue();
    await deleteTask(5, 12);

    expect(taskModel.delete).toHaveBeenCalledWith(5, 12);
    expect(taskModel.delete).toHaveBeenCalledTimes(1);

  });

  it("lance une erreur si il n'y a pas de tâches", async () => {
    await expect(deleteTask(5, undefined)).rejects.toThrow(
      "Veuillez préciser un identifiant de tâche.",
    );
    expect(taskModel.delete).not.toHaveBeenCalled();
  });
});

describe("updateTask", ()=>{

    beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Lance une erreur si taskID est manquant", async () =>{

    await expect(updateTask(5, undefined, "passer mon permis")).rejects.toThrow("Veuillez préciser un identifiant de tâche.")
    expect(taskModel.update).not.toHaveBeenCalled();


  })
  it("Lance une erreur si description est manquant", async () =>{

    await expect(updateTask(5, 8, "")).rejects.toThrow("Description manquante.")
    expect(taskModel.update).not.toHaveBeenCalled();


  })
  it("Vérifie que taskModel est appelé avec les bons paramètres", async () =>{
taskModel.update.mockResolvedValue();
   await updateTask(5, 8, "Passer le permis");
    expect(taskModel.update).toHaveBeenCalledWith(5, 8, "Passer le permis");
    expect(taskModel.update).toHaveBeenCalledTimes(1);
  })





})