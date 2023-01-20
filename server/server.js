const express = require('express');
const server = express();
const model = require('../model/tasks.js');

server.get('/', (request, response) => {
	const tasks = model.listTasks();
	const list = tasks.map(Task);
	const body = /*html*/ `
    <!doctype html>
    <form method="POST">
      <input id="content" name="content" aria-label="New task" required>
      <button>Add task +</button>
    </form>
    <ul>${list.join('')}</ul>
  `;
	response.send(body);
});

server.post('/', express.urlencoded({ extended: false }), (request, response) => {
	const task = {
		content: request.body.content,
		complete: 0,
	};
	model.createTask(task);
	response.redirect('/');
});

server.post('/update', express.urlencoded({ extended: false }), (req, res) => {
	const { action, id } = req.body;
	if (action === 'remove') model.removeTask(id);
	if (action === 'toggle') model.toggleTask(id);
	res.redirect('/');
});

function Task(task) {
	return /*html*/ `
    <li>
      <form method="POST" action="/update">
        <input type="hidden" name="id" value="${task.id}">
        <button name="action" value="toggle" aria-label="Toggle complete">
          ${task.complete ? '☑︎' : '☐'}
        </button>
        <span style="${task.complete ? 'text-decoration: line-through' : ''}">
          ${task.content}
        </span>
        <button name="action" value="remove">&times;</button>
      </form>
    </li>
  `;
}

module.exports = server;
