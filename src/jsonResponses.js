// for the post data
const { parse } = require('querystring');

// Note this object is purely in memory
const users = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const getPostData = (request, callback) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => {
    callback(parse(body));
  });
};

const updateUser = (request, response) => {
  const responseJSON = {
    message: 'Created Successfully',
  };

  getPostData(request, (postData) => {
    // first check if we have the fields
    if (postData.name === '' || postData.age === '') {
      responseJSON.message = 'Name and age are both required';
      return respondJSON(request, response, 400, responseJSON);
    }
    // looking to update
    if (users[postData.name]) {
      users[postData.name].age = postData.age;
      return respondJSONMeta(request, response, 204);
    }
    // assume new record

    const newUser = {
      name: postData.name,
      age: postData.age,
    };
    users[postData.name] = newUser;
    return respondJSON(request, response, 201, responseJSON);
  });
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you seek is not here',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  updateUser,
  notFound,
  notFoundMeta,
};
