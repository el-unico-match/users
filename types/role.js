/**
 *  @returns {object} Los tipos de usuarios:
 * 1) administrador
 * 2) supervisor
*/
const ROLES = Object.freeze({
    ADMINISTRATOR: "administrador", 
    CLIENT: "cliente", 
});

/**
 * 
 * @param {String} role 
 * @returns Verdadero si parámetro "role" es un rol válido.
 */
const isRole = (role) => {
    switch (role) {
        case ROLES.ADMINISTRATOR:
            return true;    
        case ROLES.CLIENT:
            return true;   
        default:
            return false;
    }

}

module.exports = {
    ROLES,
    isRole
}