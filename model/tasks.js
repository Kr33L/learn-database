const db = require('../database/db.js');

const insert_task = db.prepare(/*sql*/ `
  INSERT INTO tasks (content, complete)
  VALUES ($content, $complete)
  RETURNING id, content, created_at
`);

const select_tasks = db.prepare(/*sql*/ `
  SELECT
    id,
    content,
    TIME(created_at) AS created_at,
    complete
  FROM tasks
`);

const delete_task = db.prepare(/*sql*/ `
  DELETE FROM
    tasks
  WHERE id = ?
`);

const update_content = db.prepare(/*sql*/ `
  UPDATE tasks
  SET content = $content
  WHERE id = $id
  RETURNING id, content, created_at, complete
`);

const update_complete = db.prepare(/*sql*/ `
  UPDATE tasks
  SET complete = NOT complete
  WHERE id = ?
  RETURNING id, content, created_at, complete
`);

function createTask(content) {
	return insert_task.get(content);
}

function removeTask(id) {
	delete_task.run(id);
}

function editTask(task) {
	return update_content.get(task);
}

function listTasks() {
	return select_tasks.all();
}

function toggleTask(id) {
	return update_complete.get(id);
}

module.exports = { createTask, removeTask, editTask, listTasks, toggleTask };
