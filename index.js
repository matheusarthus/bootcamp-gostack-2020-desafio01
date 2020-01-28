const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let cont_req = 0; 

// Middleware global de contagem de requisições
server.use((req, res, next) => {

  console.count("Número de requisições");

  next();

})

// Middleware local de checagem de ID
function checkId(req, res, next) {
  const { id } = req.params;

  const project = projects.find((p) => p.id == id);
  const projectIndex = projects.findIndex((p) => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found."});
  }

  req.project = project;
  req.projectIndex = projectIndex;

  return next();
}

// Rota para a listagem de todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
})

// Rota para a criação de novos projetos
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({ id:id, title:title, tasks: [] });
  
  return res.json(projects);
})

// Rota para inserir tarefas no projeto
server.post('/projects/:id/tasks', checkId, (req, res) => {
  const { title } = req.body;
  const project = req.project;

  project.tasks.push(title);

  return res.json(projects);
})

// Rota para alterar o título do projeto
server.put('/projects/:id', checkId, (req, res) => {
  const { title } = req.body;
  const project = req.project;

  project.title=title;

  return res.json(projects);
})

// Rota para deletar um projeto através do id
server.delete('/projects/:id', checkId, (req, res) => {
  const projectIndex = req.projectIndex

  projects.splice(projectIndex, 1);

  return res.send('Projeto deletado com sucesso!');
})

server.listen(3000);