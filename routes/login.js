/*
    Rutas de Usuarios /login
    host + /api/login
*/

const {Router} = require('express');
const {loginUser} = require('../controllers/auth');
const {checkLoginUser} = require('../middlewares/checkers/users');

const router = Router();

// Login de usuario
router.post('/', checkLoginUser, loginUser);

module.exports = router;