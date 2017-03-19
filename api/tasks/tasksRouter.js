const express = require('express');
const router = express.Router();
const debug = require('debug')('REST-SQLZ');
const models = require('../models');
const taskDS = require('./tasksDS');
const userDS = require('../users/usersDS');


const Task = models.Task;
const User = models.User;

function sendSuccess(res,data){
    res.status(200);
    res.json(data);
}

function sendError(res,err){
    // console.log(err.toString());
    res.status(400);
    // res.json({err:err.toString()});
    res.json(err);
}


router.post('/create', function (req, res) {
  let task = {
    title: req.body.title,
    durationInMins: req.body.durationInMins,
    description: req.body.description,
    status:"OPEN"
  };
  taskDS.createTask(task).then(taskRtn => sendSuccess(res,taskRtn))
      .catch(err => sendError(res,err));

});



router.get('/', (req, res) => {
  taskDS.getAllTasks().then( tasks=>{
    const tasksRtn = prepareAllTasksRtnData(req,tasks);
    sendSuccess(res,tasksRtn);
  })
  .catch(err=>sendError(res,err));
});


router.get('/:task_id', (req, res) => {
  taskDS.getTask(req.params.task_id).then(task => {
    const taskRtn = prepareTaskRtnData(req,task);
    sendSuccess(res,taskRtn);
  }).catch(err => sendError(res,err));
});

router.put('/:task_id/assign', (req, res) => {
  const task_id = req.params.task_id;
  const user_id = req.body.user_id;

  validateAssignTask(user_id,task_id).then(()=>{
      Task.update({status: "ASSIGNED", UserId:user_id}, {where: {_id: task_id}})
        .then((result) => {
          res.json({result:`Task ${task_id} assigned to User ${user_id}`});
        })
        .catch((err) => {
          res.json(err.message[0])
        });
  })
  .catch(err=>{
    sendError(res,{err:err.message});
  });

});


async function validateAssignTask(user_id,task_id){
  const user = await userDS.getUser(user_id);
  const task = await taskDS.getTask(task_id);
  const errors = [];
  if(!user._id) errors.push(user.err);
  if(!task._id) errors.push(task.err);
  if (errors.length==0) return true
  else throw Error(errors.join(",  "));
}

router.put('/:task_id/unassign', (req, res) => {
  const task_id = req.params.task_id;
  const user_id = req.body.user_id;

  Promise.all([validateTask(task_id), validateUser(user_id)])
    .then(() => {
      Task.update({status: "OPEN", UserId: null}, {where: {_id: req.params.task_id}})
        .then((result) => {
          res.json({result:`Task ${task_id} is OPEN and not assigned to any User`});
        })
        .catch((err) => res.json(err));

    })
    .catch((err) => res.json(err));
});


const validateUser = (user_id) => {
  return new Promise((resolve, reject) => {
    User.findOne({where: {_id: user_id}})
      .then((user) => {
        user ? resolve() : reject({err: "Invalid user_id"})
      })
      .catch((err) => reject(err));
  });
}

const validateTask = (task_id) => {
  return new Promise((resolve, reject) => {
    Task.findOne({where: {_id: task_id}})
      .then((task) => {
        task ? resolve() : reject({err: "Invalid task_id"})
      })
      .catch((err) => reject(err));
  });
}


router.get('/:task_id/destroy', function (req, res) {
  Task.destroy({
    where: {
      _id: req.params.task_id
    }
  })
    .then(function () {
      res
        .status(204)
        .send('Removed');
    });
});

function prepareAllTasksRtnData(req,tasks){
    let tasksRtn = [];
    if (tasks && tasks.length > 0) {
      for (let task of tasks) {
        if (task) {
          let taskRtn = Object.assign({}, {_type: "Task"}, task.toJSON());
          taskRtn.UserId = task.UserId ? task.UserId : "NOT_ASSIGNED";
          taskRtn.links = {};
          taskRtn.links.self = `http://${req.headers.host}/api/tasks/${task._id}`;
          taskRtn.links.user = task.UserId ? `http://${req.headers.host}/api/users/${taskRtn.UserId}` : "NOT_ASSIGNED";
          tasksRtn.push(taskRtn);
        }
      }
    }
    return tasksRtn;
}

function prepareTaskRtnData(req,task){
  if (task._id) {
    task = Object.assign({}, {_type: "Task"}, task);
    task.UserId = task.UserId ? task.UserId : "NOT_ASSIGNED";
    task.links = {};
    task.links.user = task.UserId ? `http://${req.headers.host}/api/users/${task.UserId}` : "NOT_ASSIGNED";
    task.links.allTasks = `http://${req.headers.host}/api/tasks/`;
  }
  return task;
}

module.exports = router;
