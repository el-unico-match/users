const User = require('../models/Users');

const newUser = (userScrema) => {
    return new User(userScrema);
}

const saveUser = async (user) => {
    user.save();
}

module.exports = {
    newUser,
    saveUser
}
