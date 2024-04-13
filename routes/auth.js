/*
    Rutas de Usuarios /Auth
    host + /api/auth
*/

const {Router} = require('express');
const {
    validateJWT,
    validateLazyJWT} = require('../middlewares/validateJWT');
const {
    createUser, 
    loginUser, 
    updateUser, 
    deleteUser,
    getUsers, 
    revalidateToken,
    validateToken} = require('../controllers/auth');
const {
    checkCreateUser,  
    checkLoginUser,
    checkUpdateUser,
    checkDeleteUser,    
    checkRevalidateToken} = require('../middlewares/checkers/users');

const router = Router();

// Crear usuario
router.post('/new', validateLazyJWT, checkCreateUser, createUser);

// Login de usuario
router.post('/', checkLoginUser, loginUser);

// Actualizar usuario
router.put('/:id', validateJWT, checkUpdateUser, updateUser);

// Borrar usuario
router.delete('/:id', validateJWT, checkDeleteUser, deleteUser);

// Obtener usuarios
router.get('/', validateJWT, getUsers);

// Revalidar token
router.get('/renew', checkRevalidateToken, validateJWT, revalidateToken);

// Check token
router.get('/validate', validateJWT, validateToken);

module.exports = router;