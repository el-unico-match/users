/**
 *  @returns {object} Los tipos de niveles de log:
*/
const LOG_LEVELS = Object.freeze({
    DEBUG : {
        level: 10,
        tag: "DEBUG"
    },
    INFO : {
        level: 20,
        tag: "INFO"
    },
    WARNING : {
        level: 30,
        tag: "WARNING"
    },
    ERROR : {
        level: 40,
        tag: "ERROR"
    }
});

module.exports = {
    LOG_LEVELS
}