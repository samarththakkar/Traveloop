const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();
const admin = (req, res, next) => next();

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
