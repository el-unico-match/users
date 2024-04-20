/*
    Rutas de Usuarios /login
    host + /api/login
*/

const {Router} = require('express');
const {loginUser} = require('../controllers/login');
const {checkLoginUser} = require('../middlewares/checkers/login');

const router = Router();

// Login de usuario
router.post('/', checkLoginUser, loginUser);

module.exports = router;