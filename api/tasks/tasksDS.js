const models = require('../models');
const debug = require('debug')('REST-SQLZ');

async function createTask(task) {
  try {
    //TODO Validate input
    let taskRtn = await models.Task.create(task).then(data => data.toJSON());
    taskRtn = Object.assign({}, taskRtn, task);
    return taskRtn;
  } catch (err) {
    console.log(err);
    console.log(err.errors[0]);
    throw Error(err.errors[0].message);
  }
}

async function getAllTasks() {
  try {
    let tasks = await models.Task.findAll();
    return tasks;
  } catch (err) {
    console.error(err.message);
    throw Error(err.message);
  }
}

async function getTask(task_id){
  try{
    let task = await models.Task.findOne({ where: { _id: task_id } });
    return task?task.toJSON():{ err: "Validation Error : Invalid TaskId !!" }
  }catch(err){
    debug(err);
    throw Error(err.message)
  }
}

module.exports.createTask = createTask;
module.exports.getAllTasks = getAllTasks;
module.exports.getTask = getTask;
