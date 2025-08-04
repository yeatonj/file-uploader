const bcrypt = require("bcryptjs");

async function genPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

async function validPassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
}

module.exports = {
    genPassword,
    validPassword
}