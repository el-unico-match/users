const SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const LENGTH_PIN = 6;

const generatePin = () => {
    let pin = "";
    for (let i = 0; i < LENGTH_PIN; i++) {
        pin += SET.charAt(Math.floor(Math.random() * SET.length));
    }
    return pin;
};

module.exports = {
    generatePin
}