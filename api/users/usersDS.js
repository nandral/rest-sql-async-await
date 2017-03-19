const models = require('../models');
const debug = require('debug')('REST-SQLZ');

async function createUser(user) {
  try {
    //TODO Validate input
    let userRtn = await models.User.create(user).then(data => data.toJSON());
    userRtn = Object.assign({}, userRtn, user);
    return userRtn;
  } catch (err) {
    //err=err.toJSON();
    // console.log(err.errors[0]);
    throw Error(err.errors[0].message);
  }
}

async function getAllUsers() {
  try {
    let users = await models.User.findAll({ include: [models.Task]});
    return users;
  } catch (err) {
    console.error(err.message);
    throw Error(err.message);
  }
}

async function getUser(user_id){
  try{
    let user = await models.User.findOne({ where: { _id: user_id }, include: [models.Task] });
    return user?user.toJSON():{ err: "Validation Error : Invalid UserId !!!" }
  }catch(err){
    debug(err);
    throw Error(err.message)
  }
}

module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getUser = getUser;
