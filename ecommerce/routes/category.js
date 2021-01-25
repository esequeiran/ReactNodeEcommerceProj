const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { create, categoryById, read, update, remove, list } = require("../controllers/category");
const { userById } = require('../controllers/user');

//http methods
router.get('/category/:categoryId', read)
router.get('/categories', list)
router.post('/category/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);

//params middlewares
router.param("userId", userById)
router.param("categoryId", categoryById)

module.exports = router;
