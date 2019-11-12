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
  await supertester.startDB();
  console.log(await new Roles(roles.admin));
  const admin = new Roles(roles.admin).save();
  const editor = new Roles(roles.editor).save();
  const user = new Roles(roles.user).save();
  done();
});

afterAll(supertester.stopDB);

describe('The proper authorization is implemented with routes', () => {
  it('Allows unauthenticated users to access the /public route', async () => {
    let test = await mockServer.get('./public');
    console.log('TEST: ', test);
    expect(test.status).toBe(200);
  });
  it('xxx', () => {});
  it('xxx', () => {});
  it('xxx', () => {});
  it('xxx', () => {});
  it('xxx', () => {});
});
