'use strict';

process.env.SECRET = 'test';

const jwt = require('jsonwebtoken');

const Roles = require('../src/models/roles-model');
const server = require('../src/server.js').server;
const supertester = require('./supertester.js');

const mockServer = supertester.server(server);

let users = {
  admin: {
    username: 'sarah',
    password: 'sarahpassword',
    email: 'sarah@email.com',
    role: 'admin',
  },
  editor: {
    username: 'bill',
    password: 'billpassword',
    email: 'bill@email.com',
    role: 'editor',
  },
  user: {
    username: 'rene',
    password: 'renepassword',
    email: 'rene@email.com',
    role: 'user',
  },
};

let roles = {
  admin: {
    role: 'admin',
    capabilities: ['create', 'read', 'update', 'delete', 'superuser'],
  },
  editor: { role: 'editor', capabilities: ['create', 'read', 'update'] },
  user: { role: 'user', capabilities: ['read'] },
};

beforeAll(async done => {
  let rolesDB = new Roles();
  await supertester.startDB();
  await rolesDB.create(roles.admin);
  await rolesDB.create(roles.editor);
  await rolesDB.create(roles.user);
  done();
});

afterAll(supertester.stopDB);

describe('The proper authorization is implemented with routes', () => {
  it('Allows users to signup', async () => {
    let test = await mockServer.post('/signup').send({
      username: 'james',
      password: 'jamespassword',
      email: 'james@email.com',
      role: 'admin',
    });
    expect(test.status).toBe(200);
  });
  it('Allows unauthenticated users to access the /public route', async () => {
    let test = await mockServer.get('/role/public');
    expect(test.status).toBe(200);
  });
  it('Blocks unauthorized users from accessing the hidden route', async () => {
    let test = await mockServer.get('/role/hidden');
    expect(test.status).toBe(401);
  });
  it('Allows authorized users to access the hidden route', async () => {
    let encodedData =
      'Basic ' +
      Buffer.from(users.admin.username + ':' + users.admin.password).toString(
        'base64',
      );
    let authPerson = await mockServer
      .post('/signin')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', encodedData)
      .set('Timeout', false);
    // console.log('DAT DUDE: ', authPerson.body);
    let test = await mockServer.get('/role/hidden');
    expect(test.status).toBe(200);
  });
  it('Allows authenticated users to access the read-only route', async () => {
    // let test = await mockServer.post('/role/read-only');
    // expect(test.status).toBe(200);
  });
  it('xxx', async () => {
    let test = await mockServer.get('/role/public');
    expect(test.status).toBe(200);
  });
  it('xxx', async () => {
    let test = await mockServer.get('/role/public');
    expect(test.status).toBe(200);
  });
  it('xxx', async () => {
    let test = await mockServer.get('/role/public');
    expect(test.status).toBe(200);
  });
  it('xxx', async () => {
    let test = await mockServer.get('/role/public');
    expect(test.status).toBe(200);
  });
  it('xxx', async () => {
    let test = await mockServer.get('/role/public');
    expect(test.status).toBe(200);
  });
  it('xxx', async () => {
    let test = await mockServer.get('/role/public');
    expect(test.status).toBe(200);
  });
});
