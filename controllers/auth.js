const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const {generateJWT} = require('../helpers/jwt')
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {
    MSG_USER_EXISTS,
    MSG_USER_NOT_EXISTS,
    MSG_PASSWORD_INCORRECT
} = require('../messages/auth');
    
const createUser = async (req, res = response) => {
    try {
        // Check en DB si ya existe el usuario
        const {email, password, role} = req.body;
        let user = await User.findOne({email: email});
        if (user){
            return res.status(400).json({
                ok: false,
                msg: MSG_USER_EXISTS
            });
        }
        user = new User(req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        // Guardar en DB
        await user.save();        
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            email,
            token,
            role            
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

const loginUser = async (req, res = response) => {
    try {
        // Check en DB si ya existe el usuario
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if (!user){
            return res.status(400).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        }
        // Confirmar contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: MSG_PASSWORD_INCORRECT
            });    
        }
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
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
            return res.status(404).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });        
        }
        const newUser = {
            ...req.body,
        }
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        newUser.password = bcrypt.hashSync(newUser.password, salt);
        // Actualizar en DB
        const userUpdated = await User.findByIdAndUpdate(userId, newUser, {new: true});
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(userUpdated.id, userUpdated.name);
        res.json({
            ok: true,
            msg: {
                id: userUpdated._id,
                name: userUpdated.name,
                email: userUpdated.email,
                role: userUpdated.role,
                token: token
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
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
            return res.status(404).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            })
        }
        await User.findByIdAndDelete(userId);
        res.json({
            ok: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: MSG_ERROR_500
        });
    }
}

const getUsers = async (req, res = response) => {
    const users = await User.find();
    //TODO: Dejar de mostrar password
    res.json({
        ok: true,
        users
    })
}

const revalidateToken = async (req, res = response) => {
    const {uid, name} = req;
    // Generar el JWT (Java Web Token)
    const token = await generateJWT(uid, name);
    res.status(200).json({
        ok: true,
        token
    });
}

const validateToken = async (req, res = response) => {
    res.status(200).json({
        ok: true
    });
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUsers,
    revalidateToken,
    validateToken
}