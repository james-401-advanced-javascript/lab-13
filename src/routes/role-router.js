'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const err401 = require('../middleware/401');
const err403 = require('../middleware/403');
const Roles = require('../models/roles-model');
const roles = new Roles();

// TODO: Swagger Comments
// Visible by all clients
router.get('/public', (req, res, next) => {
  res.status(200).json({ valid: true });
});

router.use(auth);
router.use(err401);

async function checkAccess(req, res, next, accessParam) {
  if (req.user && req.user._id) {
    let role = req.user.role;
    let roleData = await roles.getFromField({ role });
    console.log('Role Data: ', roleData);
    if (roleData.length >= 1) roleData = roleData[0];
    if (roleData.capabilities.includes(accessParam))
      res.status(200).json({ valid: true });
    else next('Incorrecr role access');
  } else next('Unable to find user');
}

// === TODO: Define all the routes below ======

// TODO: Swagger Comments
// Visible by logged in clients
router.get('/hidden', (req, res, next) => {
  if (req.user && req.user._id) {
    res.status(200).json({ valid: true });
  } else next('Unable to find user');
});

// TODO: Swagger Comments
// Visible by roles that have the "read" capability
router.get('/read-only', (req, res, next) => {
  checkAccess(req, res, next, 'read');
});

// TODO: Swagger Comments
// Accessible by roles that have the "create" capability
router.post('/create', (req, res, next) => {
  checkAccess(req, res, next, 'create');
});

// TODO: Swagger Comments
// Accessible by roles that have the "update" capability
router.put('/update/:id', (req, res, next) => {
  checkAccess(req, res, next, 'update');
});

// TODO: Swagger Comments
// Accessible by roles that have the "delete" capability
router.delete('/delete/:id', (req, res, next) => {
  checkAccess(req, res, next, 'delete');
});

// TODO: Swagger Comments
// Visible by roles that have the "superuser" capability
router.get('/super', (req, res, next) => {
  checkAccess(req, res, next, 'superuser');
});

router.use(err403);

module.exports = router;
