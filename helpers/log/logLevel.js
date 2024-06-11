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

/**
 * 
 * @param {*} numberLevel Ejemplo: 0, 10, 14, 20, 30, 40, 100
 * @returns El nivel de log comprendido en ese rango
 */
const getLogLevel = (numberLevel) => {
    if (numberLevel <= LOG_LEVELS.DEBUG.level) {
        return LOG_LEVELS.DEBUG;
    }
    if (numberLevel <= LOG_LEVELS.INFO.level) {
        return LOG_LEVELS.INFO;
    }
    if (numberLevel <= LOG_LEVELS.WARNING.level) {
        return LOG_LEVELS.WARNING;
    }
    return LOG_LEVELS.DEBUG;
}

module.exports = {
    LOG_LEVELS,
    getLogLevel
}