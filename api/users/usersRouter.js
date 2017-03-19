const express = require('express');
const router = express.Router();
const debug = require('debug')('REST-SQLZ');

const models = require('../models');
const usersDS = require('./usersDS');


router.post('/create', function (req, res) {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth
  }

  usersDS.createUser(user).then(userRtn => {
    res.status(201);
    res.json(userRtn);
  }).catch(err => sendError(res,err));

});

router.get('/', (req, res) => {
  usersDS.getAllUsers().then(users => {
    let usersRtn = prepareAllUsersRtnData(req, users);
    sendSuccess(res,usersRtn);
  }).catch(err => sendError(res,err));
});


router.get('/:user_id', function (req, res) {
  usersDS.getUser(req.params.user_id).then(user=>{
    let userRtn = prepareUserRtnData(req, user);
    sendSuccess(res,userRtn);
  }).catch(err =>sendError(res,err));
});

function sendSuccess(res,data){
    res.status(200);
    res.json(data);
}

function sendError(res,err){
    console.log(err.toString());
    res.status(400);
    res.json({err:err.toString()});
}

function prepareAllUsersRtnData(req, users) {
  const returnUsers = [];
  for (let user of users) {
    user = Object.assign({}, { _type: "User" }, user.toJSON());
    //Add self links, task links
    user.links = {};
    user.links.self = `http://${req.headers.host}/api/users/${user._id}`
    user.Tasks = prepareTasksForUser(req, user.Tasks);
    returnUsers.push(user);
  }

  return returnUsers;
}

function prepareUserRtnData(req, user) {
  if (user._id) {
        user = Object.assign({}, {_type: "User"}, user);
        //Add self links, task links
        user.links = {};
        let allUsers = 'http://' + req.headers.host + '/api/users/';
        user.links.allUsers = allUsers.replace(' ', '%20');
        user.Tasks = prepareTasksForUser(req, user.Tasks);
  }
  return user;
}

const prepareTasksForUser = (req, tasks) => {
  let tasksWithLinks = [];
  for (let task of tasks) {
    let taskRtn = Object.assign({}, {
      _type: "Task"
    }, task)
    taskRtn.links = {};
    let self = `http://${req.headers.host}/api/tasks/${task._id}`;
    taskRtn.links.self = self.replace(' ', '%20');
    tasksWithLinks.push(taskRtn)
  }
  return tasksWithLinks;
}

router
  .get('/:user_id/destroy', function (req, res) {
    models
      .User
      .destroy({
        where: {
          _id: req.params.user_id
        }
      })
      .then(function () {
        res
          .status(204)
          .send('Removed');
      });
  });

module.exports = router;
