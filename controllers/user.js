const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const {generateJWT} = require('../helpers/jwt');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {
    MSG_USER_EXISTS,
    MSG_USER_NOT_EXISTS
} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');

/**
 * 
 * @param {*} req Si el request tiene blocked vacío lo setea en falso.
 */
const prepareBlocked = (req) => {
    if (!req.body.blocked) {
        req.body.blocked = false;
    }
}   

const createUser = async (req, res = response) => {
    try {
        // Normalizar el parámetro del body
        prepareBlocked(req);
        // Check en DB si ya existe el usuario
        const {email, password, role, blocked} = req.body;
        let user = await User.findOne({email: email});
        if (user){
            return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
                ok: false,
                msg: MSG_USER_EXISTS
            });
        };        
        // Crear un nuevo usuario en base al body
        user = new User(req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        // Guardar en DB
        await user.save();        
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(user.id, user. role, user.blocked);
        res.status(HTTP_SUCCESS_2XX.CREATED).json({
            ok: true,
            user: {
                id: user.id,
                email,
                role,
                blocked         
            },            
            token            
        });    
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

const updateUser = async (req, res = response) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });        
        }
        const newUser = {
            ...req.body,
        }
        newUser.email ||= user.email;
        if (newUser.blocked === undefined) {
            newUser.blocked = user.blocked;
        };       
        newUser.role = user.role;
        // Encriptar contraseña
        if (newUser.password) {
            const salt = bcrypt.genSaltSync();
            newUser.password = bcrypt.hashSync(newUser.password, salt);
        } else {
            newUser.password = user.password;    
        }       
        // Actualizar en DB
        const userUpdated = await User.findByIdAndUpdate(userId, newUser, {new: true});
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(userUpdated.id, userUpdated.role, userUpdated.blocked);
        res.status(HTTP_SUCCESS_2XX.OK).json({
            ok: true,
            user: {
                id: userUpdated._id,
                email: userUpdated.email,
                role: userUpdated.role,
                blocked: userUpdated.blocked
            },
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        });
    }   
}

const getUser = async (req, res = response) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({_id: userId}, {_id:1, email: 1, role:1, blocked:1});
        if (!user) {
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        } else {
            res.status(HTTP_SUCCESS_2XX.OK).json({
                ok: true,
                users: user
            });
        }      
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        }); 
    }    
}

const deleteUser = async (req, res = response) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            })
        }
        await User.findByIdAndDelete(userId);
        res.status(HTTP_SUCCESS_2XX.OK).json({
            ok: true
        });
    } catch (error) {
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        });
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUser
}