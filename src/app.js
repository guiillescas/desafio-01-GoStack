const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.status(200).send(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body

  const repository = {
    id: uuid(),
    likes: 0,
    techs,
    title,
    url,
  }

  repositories.push(repository)

  return res.status(200).json(repository)
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params
  const { title, url, techs } = req.body

  if (!id) return res.status(400).json({ error: 'You need to provide and id to update an repository! :)' })

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid project ID :(' })
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    res.status(400).json({ error: 'Project not found :(' })
  }

  const repository = {
    id,
    likes: repositories[repositoryIndex].likes,
    techs,
    title,
    url,
  }

  repositories[repositoryIndex] = repository

  return res.status(200).json({ repository })
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    res.status(400).json({ error: 'Project not found :(' })
  }

  repositories.splice(repositoryIndex, 1)

  return res.status(204).send('')
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if ( !isUuid(id) ) {
    return res.status(400).json({ error: 'Repository not found :(' })
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1
  
  return res.status(200).json(repositories[repositoryIndex])
});

module.exports = app;
