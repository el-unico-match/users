const {response} = require('express');

const getStatus = async (req, res = response) => {
    res.json({
        ok: true,
    })
}

module.exports = {
    getStatus,
}