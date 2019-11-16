'use strict';

const { startDB, stopDB } = require('./supertester.js');
const auth = require('../src/middleware/auth');
const Users = require('../src/models/users-model');
const Roles = require('../src/models/roles-model');

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
  let usersDB = new Users();
  let rolesDB = new Roles();
  await startDB();
  await usersDB.create(users.admin);
  await usersDB.create(users.editor);
  await usersDB.create(users.user);
  await rolesDB.create(roles.admin);
  await rolesDB.create(roles.editor);
  await rolesDB.create(roles.user);
  done();
});

afterAll(stopDB);

/* describe('xxx', () => {
  it('xxx', () => { }); 
}); */
