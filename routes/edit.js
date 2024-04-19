/*
    Rutas de Usuarios /edit
    host + /api/edit
*/

const {Router} = require('express');
const {
    validateJWT,
    validateLazyJWT} = require('../middlewares/validateJWT');
const {
    createUser,  
    updateUser, 
    deleteUser} = require('../controllers/auth');
const {
    checkCreateUser,
    checkUpdateUser,
    checkDeleteUser,    
    } = require('../middlewares/checkers/users');

const router = Router();

// Crear usuario
router.post('/', validateLazyJWT, checkCreateUser, createUser);

// Actualizar usuario
router.put('/:id', validateJWT, checkUpdateUser, updateUser);

// Borrar usuario
router.delete('/:id', validateJWT, checkDeleteUser, deleteUser);

module.exports = router;