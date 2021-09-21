const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');


const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.map(user => user.username === username);

  // if user does not exist return status code 400
  if (!user) {
    return response.status(400).json({ message: 'User not found'})
  }

  request.user = user;
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists!'});
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  return response.status(200).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

});

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

  return response.state(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;