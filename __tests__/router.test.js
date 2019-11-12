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
  it('Allows unauthenticated users to access the /public route', async () => {
    let test = await mockServer.get('/role/public');
    expect(test.status).toBe(200);
  });
  it('xxx', () => {});
  it('xxx', () => {});
  it('xxx', () => {});
  it('xxx', () => {});
  it('xxx', () => {});
});
