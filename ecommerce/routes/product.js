const express = require('express');
const router = express.Router();
const {requireSignin, isAuth, isAdmin} =require("../controllers/auth");
const {create, productById, read, remove, update, list, listRelated, listCategories, listBySearch,photo, listSearch} =require("../controllers/product");
const { userById } = require('../controllers/user');

router.get("/product/:productId", read);
router.get("/products",list);
router.get("/products/search",listSearch);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.get("/product/photo/:productId", photo)
router.post('/product/:userId', requireSignin, isAuth, isAdmin, create);
router.post("/products/by/search", listBySearch); 
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
