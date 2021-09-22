const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  // if user does not exist return status code 400
  if (!user) {
    return response.status(400).json({ error: 'User not found'})
  }

  request.user = user;

  return next();
}

// Create user
app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.find((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'Username already exists!'});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(users);
});

// List TODO
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request; // Ja me retorna o usuario que quero

  return response.status(200).json(user.todos)
});

// Create TODO
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request; // * retornado o usuario existente pelo middleware checkExistsUserAccount

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request; // get user object
  const { title, deadline} = request.body;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id)

  if (!todo) {
    return response.status(400).json({ error: 'Todo not exists!'})
  }

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request; // get user object
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id)

  if (!todo) {
    return response.status(400).json({ error: 'Todo not exists!'})
  }

  todo.done = true

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request; // get user object
  const { id } = request.params;

  const todo = user.todos.findIndex(todo => todo.id === id)

  if (!todo) {
    return response.status(400).json({ error: 'Todo not exists!'})
  }

  user.todos.splice(todo, 1)

  return response.status(200).send();
});

module.exports = app;