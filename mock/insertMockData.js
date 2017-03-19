/**
 * Created by nandral on 10/03/2017.
 */
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');


const url = 'http://localhost:5000'


const filePath = path.join(__dirname, 'db.json');

const mockData = JSON.parse(fs.readFileSync(filePath));
console.log(mockData.users[0]);

// const body = mockData.users[0];

var postUserPromises = [];
for (const user of mockData.users) {
  var promise = fetch(`${url}/api/users/create`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {'Content-Type': 'application/json'},
  });
  postUserPromises.push(promise);
}

Promise.all(postUserPromises)
  // .then(responses => responses.map(response => response.statusText))
  .then(responses => responses.map(response => response.body))
  .then(status => console.log(status))

  .catch((err) => {
    console.log(err)
  });

// fetch(`${url}/api/users/create`, {
//   method: 'POST',
//   body: JSON.stringify(body),
//   headers: {'Content-Type': 'application/json'},
// })

// .then(res => res.json())
// .then(json => console.log(json));

//
// fetch(`${url}/api/users/create`, {
//   method: 'POST',
//   body: mockData.users[0],
//   headers: {'Content-Type': "application/json"}
// })
//   .then(function (res) {
//     return res.json();
//   }).then(function (json) {
//   console.log(json);
// });
//
// fetch(`${url}/api/users`)
//   .then(function (res) {
//     return res.json();
//   }).then(function (json) {
//   console.log(json);
// });
