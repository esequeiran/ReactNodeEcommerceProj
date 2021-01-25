const express = require('express');
const router = express.Router();
const { userById, read, update, purchaseHistory } = require("../controllers/user");
const {requireSignin, isAuth, isAdmin} =require("../controllers/auth");


router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res)=>{
    res.json({
        user: req.profile
    });
});
router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update)

router.get("/ordersByUser/:userId", requireSignin, isAuth, purchaseHistory);

//especificamos el nombre del paramétro en url, luego la función que sucederá
//en este caso userById buscará en la bd el usuario y lo seteará en el req.body
//para luego ser usado
router.param("userId", userById);

module.exports = router;
