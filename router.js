const router = require('express').Router();
const isAdmin = require('./middlewares/isAdmin');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const productsController = require('./controllers/productsController');
const ordersController = require("./controllers/ordersController");


router.use('/users',userController)
router.use('/admin',isAdmin,adminController)
router.use('/products',productsController)
router.use('/orders',ordersController)





router.all('*', (req,res) => {
    res.status(404).json({error:'This service does not exist!'})
})


module.exports = router;

// "htps://localhost:3030/products/:productid"