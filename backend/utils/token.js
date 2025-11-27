const jwt = require("jsonwebtoken");

module.exports = {
    generateToken(data) {
        return jwt.sign(data, "MI_SECRETO_SUPER_SEGURO", { expiresIn: "2h" });
    }
};
